import {
  CommandViewJobModel,
  CommandViewModel,
  CommandViewModelParameters,
  CommandViewRequestModel,
} from 'formHelpers'
import {
  CronTrigger,
  DateTrigger,
  IntervalTrigger,
  IntervalType,
  Job,
  RequestTemplate,
  TriggerType,
} from 'types/backend-types'
import { AugmentedCommand, ObjectWithStringKeys } from 'types/custom-types'

const getComment = (model: CommandViewRequestModel) => {
  const commentBlock = model.comment
  const comment = commentBlock.comment as string | undefined | null

  if (comment) {
    return commentBlock as { comment: string }
  }
  return { comment: '' }
}

const getInstance = (model: CommandViewRequestModel) => {
  return model.instance_names
}

/**
 * Extract the parameter arguments from the model
 *
 * @param model
 * @returns A {parameters: <model parameters>} object
 */
const getParameters = (model: CommandViewRequestModel) => {
  return {
    parameters: model.parameters,
  }
}

/**
 * Extract the parameter arguments from the model with all Bytes parameter
 * values stripped out
 *
 * @param model
 * @param command
 * @returns A {parameters: <model parameters>} object with no Bytes parameters
 */
const getBytesParameters = (
  model: CommandViewRequestModel,
  command: AugmentedCommand,
) => {
  let modelParametersCopy = JSON.parse(
    JSON.stringify(model.parameters),
  ) as CommandViewModelParameters

  for (const commandParameter of command.parameters) {
    // TODO: we only go down one level, this can be improved if it's found to
    // be necessary
    if (commandParameter.type === 'Bytes') {
      const { key: commandKey } = commandParameter

      if (commandKey in modelParametersCopy) {
        const { [commandKey]: theValue, ...rest } = modelParametersCopy
        modelParametersCopy = rest as CommandViewModelParameters
      }
    } else if (commandParameter.type === 'Dictionary') {
      const { key } = commandParameter

      if (key in modelParametersCopy) {
        let theDictionary = modelParametersCopy[key] as ObjectWithStringKeys

        for (const subParameter of commandParameter.parameters) {
          if (subParameter.type === 'Bytes') {
            const { key: subParameterKey } = subParameter

            if (subParameterKey in theDictionary) {
              const { [subParameterKey]: theDictionaryValue, ...rest } =
                theDictionary
              theDictionary = rest
            }
          }
        }
        modelParametersCopy = {
          ...modelParametersCopy,
          [key]: theDictionary,
        }
      }
    }
  }

  return { parameters: modelParametersCopy }
}

const getRequestPayload = (
  model: CommandViewRequestModel,
  command: AugmentedCommand,
  hasBytes = false,
): RequestTemplate => {
  const comment = getComment(model)
  const instance = getInstance(model)
  const parameters = hasBytes
    ? getBytesParameters(model, command)
    : getParameters(model)

  if (instance === null) {
    throw new Error(
      'Unrecoverable error extracting request template: no instance provided',
    )
  }
  if (parameters === null) {
    throw new Error(
      'Unrecoverable error extracting request template: null parameters',
    )
  }

  return {
    system: command.systemName,
    system_version: command.systemVersion,
    namespace: command.namespace,
    command: command.name,
    command_type: command.command_type,
    output_type: command.output_type,
    ...comment,
    ...instance,
    ...parameters,
  }
}

const extractJobOptionals = (model: CommandViewJobModel) => {
  if (model && 'job' in model) {
    const job = model.job as ObjectWithStringKeys

    if (
      'misfire_grace_time' in job ||
      'max_instances' in job ||
      'coalesce' in job ||
      'timeout' in job
    ) {
      return {
        ...('misfire_grace_time' in job
          ? { misfire_grace_time: job.misfire_grace_time as number }
          : null),
        ...('max_instances' in job
          ? { max_instances: job.max_instances as number }
          : null),
        ...('coalesce' in job ? { coalesce: job.coalesce as boolean } : null),
        ...('timeout' in job ? { timeout: job.timeout as number } : null),
      }
    }
    return null
  }

  return null
}

const extractName = (model: CommandViewJobModel) => {
  return { name: model.job.name }
}

interface CombinedTrigger {
  trigger: IntervalTrigger | DateTrigger | CronTrigger
  trigger_type: TriggerType
}

const getDateTrigger = (triggerData: ObjectWithStringKeys) => {
  const type: TriggerType = 'date'
  const trigger: DateTrigger = {
    run_date: Date.parse(triggerData.run_date as string),
    timezone: triggerData.date_timezone as string,
  }

  return {
    trigger_type: type,
    trigger: trigger,
  }
}

const getIntervalTrigger = (triggerData: ObjectWithStringKeys) => {
  const type: TriggerType = 'interval'
  const baseTrigger: IntervalTrigger = {
    start_date: Date.parse(triggerData.interval_start_date as string),
    end_date: Date.parse(triggerData.interval_end_date as string),
    timezone: triggerData.interval_timezone as string,
    jitter: triggerData.interval_jitter as number,
    reschedule_on_finish: triggerData.interval_reschedule_on_finish as boolean,
    seconds: 0,
    minutes: 0,
    hours: 0,
    days: 0,
    weeks: 0,
  }
  const intervalType = triggerData.interval as IntervalType

  const trigger: IntervalTrigger = {
    ...baseTrigger,
    [intervalType]: triggerData.interval_num as number,
  }

  return {
    trigger_type: type,
    trigger: trigger,
  }
}

const getCronTrigger = (triggerData: ObjectWithStringKeys): CombinedTrigger => {
  const type: TriggerType = 'cron'
  const trigger: CronTrigger = {
    minute: triggerData.minute as string,
    hour: triggerData.hour as string,
    day: triggerData.day as string,
    month: triggerData.month as string,
    day_of_week: triggerData.day_of_week as string,
    year: triggerData.year as string,
    week: triggerData.week as string,
    second: triggerData.second as string,
    timezone: triggerData.cron_timezone as string,
    ...('cron_jitter' in triggerData
      ? { jitter: triggerData.cron_jitter as number }
      : null),
    ...('cron_start_date' in triggerData
      ? { start_date: Date.parse(triggerData.cron_start_date as string) }
      : null),
    ...('cron_end_date' in triggerData
      ? { end_date: Date.parse(triggerData.cron_end_date as string) }
      : null),
  }

  return {
    trigger_type: type,
    trigger: trigger,
  }
}

/**
 * Convert RJSF format into server format
 * @param model
 * @returns
 */
const extractTrigger = (model: CommandViewJobModel): CombinedTrigger | null => {
  if (model && 'job' in model) {
    const job = model.job as ObjectWithStringKeys

    if (!job || !('trigger' in job)) return null

    const triggerType = job.trigger as TriggerType

    switch (triggerType) {
      case 'cron':
        return getCronTrigger(job)
      case 'date':
        return getDateTrigger(job)
      case 'interval':
        return getIntervalTrigger(job)
      default:
        return null
    }
  }
  return null
}

const getJobPayload = (
  model: CommandViewJobModel,
  command: AugmentedCommand,
): Job => {
  const requestTemplate = getRequestPayload(
    model as CommandViewRequestModel,
    command,
  )
  const optionals = extractJobOptionals(model)
  const trigger = extractTrigger(model)
  const name = extractName(model)

  if (!name || !trigger || !requestTemplate) {
    throw new Error('Unrecoverable error in job creation')
  }

  const job = {
    ...name,
    ...optionals,
    request_template: requestTemplate,
    ...trigger,
    id: null,
  }

  return job
}

const getSubmitArgument = (
  model: CommandViewModel,
  command: AugmentedCommand,
  isJob: boolean,
  hasBytes?: boolean,
) => {
  if (isJob) {
    return getJobPayload(model as CommandViewJobModel, command)
  } else {
    return getRequestPayload(
      model as CommandViewRequestModel,
      command,
      hasBytes,
    )
  }
}

export { getSubmitArgument }
