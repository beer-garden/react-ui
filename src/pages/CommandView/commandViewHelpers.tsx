import { Box, Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Parameter } from 'types/backend-types'
import {
  AugmentedCommand,
  ObjectWithStringKeys,
  StrippedSystem,
} from 'types/custom-types'

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
      <Button onClick={() => navigate(link, { replace: true })}>
        GO TO {`${message}`}
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
  system: StrippedSystem | undefined,
  command: AugmentedCommand | undefined,
): JSX.Element | undefined => {
  if (!namespace) {
    return <Navigator message={'systems'} link={'/systems'} />
  }
  if (!systemName) {
    return (
      <Navigator
        message={`systems : ${namespace}`}
        link={`/systems/${namespace}`}
      />
    )
  }
  if (!version || !commandName || !system || !command) {
    return (
      <Navigator
        message={`systems : ${namespace} : ${systemName}`}
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
const isByte = (parameter: Parameter): boolean => {
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
  return parameters.map(isByte).some((x) => x)
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
  initialData: ObjectWithStringKeys,
  model: ObjectWithStringKeys,
  parameters: Parameter[],
) => {
  if ('parameters' in model) {
    const updatedInitialData = { ...initialData }
    const { parameters: updatedParameters } = updatedInitialData as {
      parameters: ObjectWithStringKeys
    }
    const modelParameters = model['parameters'] as
      | ObjectWithStringKeys
      | undefined

    if (modelParameters) {
      for (const parameter of parameters) {
        if (!isByte(parameter)) continue

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
  model: ObjectWithStringKeys,
  parameters: Parameter[],
) => {
  if ('parameters' in model) {
    const modelCopy = {
      ...(model as {
        parameters: ObjectWithStringKeys
      }),
    }
    const { parameters: modelParameters } = modelCopy
    let modelParametersCopy = { ...modelParameters } as ObjectWithStringKeys

    for (const parameter of parameters) {
      // TODO: we only go down one level, this can be improved if it's found to
      // be necessary
      if (parameter.type === 'Bytes') {
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
                    [subParameterKey]: cleanUrlData(
                      theDictionaryValue as string,
                    ),
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

    const fixedModel = {
      ...modelCopy,
      parameters: modelParametersCopy,
    }

    return fixedModel
  }
  return model
}

const dataUrlToFile = (dataUrl: string) => {
  const [preface, base64] = dataUrl.split(',')
  const [dataMimeType, filename, ..._] = preface.split(';')
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

export {
  checkContext,
  cleanModelForDisplay,
  dataUrlToFile,
  handleByteParametersReset,
  isByteCommand,
}
