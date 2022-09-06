import {
  CronTrigger,
  DateTrigger,
  IntervalTrigger,
  Job,
  RequestTemplate,
  TriggerType,
} from 'types/backend-types'
import {
  AugmentedCommand,
  EmptyObject,
  ObjectWithStringKeys,
} from 'types/custom-types'

const getComment = (model: ObjectWithStringKeys) => {
  if (model && 'comment' in model) {
    const commentBlock = model.comment as ObjectWithStringKeys

    if (commentBlock && 'comment' in commentBlock) {
      const comment = commentBlock.comment as string | undefined | null

      if (comment) {
        return commentBlock as { comment: string }
      }
      return { comment: '' }
    }
    return null
  }
  return null
}

const getInstance = (model: ObjectWithStringKeys) => {
  if (model && 'instance_names' in model) {
    const instanceNames = model.instance_names as { instance_name: string }

    if (instanceNames && 'instance_name' in instanceNames) {
      return instanceNames
    }
    return null
  }
  return null
}

/**
 * Extract the parameter arguments from the model
 *
 * @param model
 * @returns A {parameters: <model parameters>} object
 */
const getParameters = (model: ObjectWithStringKeys) => {
  if (model && 'parameters' in model) {
    return {
      parameters: model.parameters as ObjectWithStringKeys | EmptyObject,
    }
  }

  return null
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
  model: ObjectWithStringKeys,
  command: AugmentedCommand,
) => {
  const theCommandsParameters = command.parameters

  if (model && 'parameters' in model) {
    const modelCopy = {
      ...(model as {
        parameters: ObjectWithStringKeys
      }),
    }
    const { parameters: modelParameters } = modelCopy
    let modelParametersCopy = { ...modelParameters } as ObjectWithStringKeys

    for (const commandParameter of theCommandsParameters) {
      // TODO: we only go down one level, this can be improved if it's found to
      // be necessary
      if (commandParameter.type === 'Bytes') {
        const { key: commandKey } = commandParameter

        if (commandKey in modelParametersCopy) {
          const { [commandKey]: theValue, ...rest } = modelParametersCopy
          modelParametersCopy = rest as ObjectWithStringKeys
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
  return null
}

const extractRequestTemplate = (
  model: ObjectWithStringKeys,
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

const extractJobOptionals = (model: ObjectWithStringKeys) => {
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

const extractName = (model: ObjectWithStringKeys) => {
  if (model && 'job' in model) {
    const job = model.job as ObjectWithStringKeys

    if ('name' in job) {
      return { name: job.name as string }
    }

    return null
  }
  return null
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
  type IntervalType = 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks'
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
      ? { end_data: Date.parse(triggerData.cron_end_date as string) }
      : null),
  }

  return {
    trigger_type: type,
    trigger: trigger,
  }
}

const extractTrigger = (
  model: ObjectWithStringKeys,
): CombinedTrigger | null => {
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
  model: ObjectWithStringKeys,
  command: AugmentedCommand,
): Job => {
  const requestTemplate = extractRequestTemplate(model, command)
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
  model: ObjectWithStringKeys,
  command: AugmentedCommand,
  isJob: boolean,
  hasBytes: boolean,
) => {
  if (isJob) {
    return getJobPayload(model, command)
  } else {
    return extractRequestTemplate(model, command, hasBytes)
  }
}

export { getSubmitArgument }
