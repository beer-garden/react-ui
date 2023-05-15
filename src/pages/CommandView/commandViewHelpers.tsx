import { Box, Button, Typography } from '@mui/material'
import { isDictionaryChoice } from 'pages/CommandView/dynamic-form'
import { useNavigate } from 'react-router-dom'
import { Command, Parameter, RequestTemplate, System } from 'types/backend-types'
import {
  AugmentedCommand,
  ObjectWithStringKeys,
  StrippedSystem,
} from 'types/custom-types'
import {
  CommandViewJobModel,
  CommandViewModel,
  CommandViewModelParameters,
  CommandViewModelParametersArrayValueType,
  CommandViewModelParametersValueType,
  CommandViewRequestModel,
} from 'types/form-model-types'

interface NavigatorProps {
  message: string
  link: string
}

/* This is an ugly placeholder */
const Navigator = ({ message, link }: NavigatorProps) => {
  const navigate = useNavigate()
  return (
    <Box>
      <Typography>ERROR</Typography>
      <Button
        color="secondary"
        onClick={() => navigate(link, { replace: true })}
      >
        {message}
      </Button>
    </Box>
  )
}

/*
    Sends us to a useful page if we came to CommandView using the wrong method.
 */
const checkContext = (
  namespace: string | undefined,
  systemName: string | undefined,
  version: string | undefined,
  commandName: string | undefined,
  system: StrippedSystem| System | undefined,
  command: AugmentedCommand | Command | undefined,
  isReplay: boolean,
  requestModel: RequestTemplate | CommandViewJobModel | CommandViewRequestModel | undefined,
): JSX.Element | undefined => {
  if (isReplay && !requestModel) {
    return (
      <Navigator
        message={'IRRECOVERABLE ERROR IN RE-EXECUTION, GO TO systems'}
        link={'/systems'}
      />
    )
  }
  if (!namespace) {
    return <Navigator message={'GO TO systems'} link={'/systems'} />
  }
  if (!systemName) {
    return (
      <Navigator
        message={`GO TO systems : ${namespace}`}
        link={`/systems/${namespace}`}
      />
    )
  }
  if (!version || !commandName || !system || !command) {
    return (
      <Navigator
        message={`GO TO systems : ${namespace} : ${systemName}`}
        link={`/systems/${namespace}/${systemName}`}
      />
    )
  }

  return undefined
}

/**
 * Determine if a Parameter is a Bytes parameter or, in the case of
 * Dictionaries, if any sub-parameter is a Bytes parameter
 *
 * @param parameter - the Parameter to check
 * @returns true or false
 */
const isByteParameter = (parameter: Parameter): boolean => {
  return (
    parameter.type === 'Bytes' ||
    (parameter.parameters.length > 0
      ? isByteCommand(parameter.parameters)
      : false)
  )
}

/**
 * Determine if any of the parameters of a command are bytes parameters
 *
 * @param parameters - the parameter array to check
 * @returns true or false
 */
const isByteCommand = (parameters: Parameter[]) => {
  return parameters.map(isByteParameter).some((x) => x)
}

/**
 * Determine if a Parameter, or any of its sub-parameters, have dynamic choices
 *
 * Distinct from hasDynamicChoiceProperties to enable recursion
 *
 * @param parameter  - the parameter array to check
 * @returns true or false
 */
const isDynamicChoiceParameter = (parameter: Parameter): boolean => {
  return (
    parameterHasDynamicChoiceProperties(parameter) ||
    hasDynamicChoices(parameter.parameters)
  )
}

/**
 * Determine if any of a commands parameters or sub-parameters have dynamic
 * choices, in which case the form will be generated in an entirely
 * different manner
 *
 * @param parameters
 * @returns
 */
const hasDynamicChoices = (parameters: Parameter[]) => {
  return parameters.map(isDynamicChoiceParameter).some((x) => x)
}

const parameterHasDynamicChoiceProperties = (parameter: Parameter) => {
  return (
    Boolean(parameter.choices) &&
    typeof parameter.choices !== 'undefined' &&
    (parameter.choices.type !== 'static' ||
      isDictionaryChoice(parameter.choices))
  )
}

/* This is a shortcut function that determines whether a command has
   dynamic choices in the most lightweight way possible. */
const commandIsDynamic = <T extends Command>(command: T): boolean => {
  return (
    command.parameters.length > 0 &&
    command.parameters.map(isDynamicChoiceParameter).some((x) => x)
  )
}

/**
 * Handle resetting the model to initial values by retaining only
 * bytes parameters values.
 *
 * @param initialData - the empty version of the model
 * @param model - the updated version of the model
 * @param parameters - the parameters of the command
 * @returns an empty model that retains the values for bytes parameters
 */
const handleByteParametersReset = (
  initialData: CommandViewRequestModel,
  model: CommandViewRequestModel,
  parameters: Parameter[],
): CommandViewRequestModel => {
  const { parameters: updatedParameters } = initialData
  const modelParameters = model.parameters

  if (modelParameters) {
    for (const parameter of parameters) {
      if (!isByteParameter(parameter)) continue

      const { key } = parameter

      if (key in modelParameters) {
        updatedParameters[key] = modelParameters[key]
      }
    }

    return {
      ...initialData,
      parameters: updatedParameters,
    }
  }

  return initialData
}

/* Pull the filename out of a dataURL string */
const cleanUrlData = (urlData: string) => {
  const parts = urlData.split(';')

  if (parts.length > 1) {
    return parts[1].split('=')[1]
  }

  return urlData
}

/**
 * Fix up the model for display in the UI so that Bytes type object don't show
 * up as extremely long strings
 *
 * @param model - the model to clean up
 * @param parameters - the parameters for the command
 * @returns cleaned up model
 */
const cleanModelForDisplay = (
  model: CommandViewModel,
  parameters: Parameter[],
  isJob: boolean,
): CommandViewModel => {
  const modelCopy: CommandViewModel = isJob
    ? (JSON.parse(JSON.stringify(model)) as CommandViewJobModel)
    : (JSON.parse(JSON.stringify(model)) as CommandViewRequestModel)
  let modelParametersCopy = JSON.parse(
    JSON.stringify(model.parameters),
  ) as CommandViewModelParameters

  for (const parameter of parameters) {
    // TODO: we only go down one level, this can be improved if it's found to
    // be necessary
    if (parameter.type === 'Bytes') {
      if (isJob)
        throw new Error('Cannot schedule command with bytes parameters')
      const { key } = parameter

      if (key in modelParametersCopy) {
        const value = modelParametersCopy[key]

        if (value) {
          modelParametersCopy[key] = cleanUrlData(value as string)
        }
      }
    } else if (parameter.type === 'Dictionary') {
      const { key } = parameter

      if (key in modelParametersCopy) {
        let theDictionary = modelParametersCopy[key] as ObjectWithStringKeys

        for (const subParameter of parameter.parameters) {
          if (subParameter.type === 'Bytes') {
            const { key: subParameterKey } = subParameter

            if (subParameterKey in theDictionary) {
              const theDictionaryValue = theDictionary[subParameterKey]

              if (theDictionaryValue) {
                theDictionary = {
                  ...theDictionary,
                  [subParameterKey]: cleanUrlData(theDictionaryValue as string),
                }
              }
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

  const fixedModel: CommandViewModel = {
    ...modelCopy,
    parameters: modelParametersCopy,
  }

  return fixedModel
}

/**
 * Removes old trigger related key/values from the model after the trigger
 * type has been changed
 * @param model
 * @param oldTrigger
 */
const removeOldTriggerKeys = (model: CommandViewModel, oldTrigger?: string) => {
  if (oldTrigger && oldTrigger !== (model as CommandViewJobModel).job.trigger) {
    Object.keys((model as CommandViewJobModel).job).forEach((key: string) => {
      if (key.startsWith(oldTrigger)) {
        delete (model as CommandViewJobModel).job[key]
      } else {
        const baseKeys = ['start_date', 'end_date', 'timezone', 'jitter']
        switch (oldTrigger) {
          case 'cron': {
            const cronKeys = [
              'year',
              'month',
              'day',
              'week',
              'day_of_week',
              'hour',
              'minute',
              'second',
              ...baseKeys,
            ]
            if (cronKeys.includes(key)) {
              delete (model as CommandViewJobModel).job[key]
            }
            break
          }
          case 'date': {
            const dateKeys = ['run_date', 'timezone']
            if (dateKeys.includes(key)) {
              delete (model as CommandViewJobModel).job[key]
            }
            break
          }
          case 'interval': {
            const intervalKeys = [
              'reschedule_on_finish',
              'days',
              'weeks',
              'hours',
              'minutes',
              'seconds',
              ...baseKeys,
            ]
            if (intervalKeys.includes(key)) {
              delete (model as CommandViewJobModel).job[key]
            }
            break
          }
        }
      }
    })
  }
}

const dataUrlToFile = (dataUrl: string) => {
  const [preface, base64] = dataUrl.split(',')
  const [dataMimeType, filename] = preface.split(';')
  const mimeMatch = dataMimeType.match(new RegExp(':(.*?)$'))

  if (!base64 || !dataMimeType || !filename || !mimeMatch) {
    throw new Error('Received malformed dataUrl, cannot continue')
  }

  const mimeType = mimeMatch[1]
  const binaryString = window.atob(base64)
  const unsignedByteArray = new Uint8Array(binaryString.length)

  for (let index = 0; index < binaryString.length; index++) {
    unsignedByteArray[index] = binaryString.charCodeAt(index)
  }

  return new File([unsignedByteArray], filename, { type: mimeType })
}

const _fixReplayAny = (
  value: CommandViewModelParametersValueType,
  parameter: Parameter,
): CommandViewModelParametersValueType => {
  if (
    parameter.type === 'Any' ||
    (parameter.type === 'Dictionary' && parameter.parameters.length === 0)
  ) {
    return JSON.stringify(value) as CommandViewModelParametersValueType
  } else if (
    parameter.type === 'Dictionary' &&
    parameter.parameters.length > 0
  ) {
    if (!parameter.multi) {
      let newParams = {}

      for (const theParameter of parameter.parameters) {
        const paramName = theParameter.key
        const theValue = value as ObjectWithStringKeys

        if (theValue !== null && paramName in theValue) {
          const paramValue = theValue[
            paramName
          ] as CommandViewModelParametersValueType
          newParams = {
            ...newParams,
            [paramName]: _fixReplayAny(paramValue, theParameter),
          }
        }
      }

      return newParams
    } else {
      const theValues = value as CommandViewModelParametersArrayValueType
      let theResults: CommandViewModelParametersArrayValueType = []

      for (const aValue of theValues) {
        const aValueAsObject =
          aValue as unknown as CommandViewModelParametersValueType
        const theResult = _fixReplayAny(aValueAsObject, {
          ...parameter,
          multi: false,
        })
        theResults = [...theResults, theResult]
      }

      return theResults
    }
  }

  return value
}

/**
 * Fix the troublesome 'Any' and 'Dictionary' types when remaking requests.
 *
 * @param requestModel
 * @param parameters
 * @returns
 */
const fixReplayAny = (
  requestModel: CommandViewRequestModel,
  parameters: Parameter[],
) => {
  let newParams: CommandViewModelParameters = {}

  for (const parameter of parameters) {
    const paramName = parameter.key
    if (paramName in requestModel.parameters) {
      newParams = {
        ...newParams,
        [paramName]: _fixReplayAny(
          requestModel.parameters[paramName],
          parameter,
        ),
      }
    }
  }

  const updatedRequestModel: CommandViewRequestModel = {
    ...requestModel,
    parameters: newParams,
  }

  return updatedRequestModel
}

export {
  checkContext,
  cleanModelForDisplay,
  commandIsDynamic,
  dataUrlToFile,
  fixReplayAny,
  handleByteParametersReset,
  isByteCommand,
  parameterHasDynamicChoiceProperties,
  removeOldTriggerKeys,
}
