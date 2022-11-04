import { Job, Parameter, RequestTemplate } from 'types/backend-types'
import { ObjectWithStringKeys } from 'types/custom-types'

const parseKey = (key: string, parameter: Parameter): string => {
  const parameterKeyPath = key.split('.')
  const parameterKeyLeaf = parameterKeyPath[parameterKeyPath.length - 1]

  if (parameterKeyLeaf !== parameter.key) {
    throw new Error(
      `Received parameter with unknown key '${parameter.key}'` +
        ` for key argument '${parameterKeyLeaf}'`,
    )
  }

  return parameterKeyLeaf
}

const fixDictionary = (
  modelParams: ObjectWithStringKeys,
  parameter: Parameter,
  key = '',
) => {
  const parameterKey = parseKey(key, parameter)

  if (!(parameterKey in modelParams)) {
    if (parameter.nullable) {
      return parameter.multi
        ? { [parameterKey]: [] }
        : {
            [parameterKey]: null,
          }
    } else if (parameter.optional || parameter.type === 'Bytes') {
      return null
    }

    throw new Error(
      `Received parameter model without needed key '${parameterKey}'`,
    )
  } else {
    if (parameter.optional) {
      if (typeof modelParams[parameterKey] === 'undefined') {
        return null
      }
    } else if (!parameter.multi) {
      if (typeof modelParams[parameterKey] === 'undefined') {
        throw new Error(
          `Received empty parameter value for non-optional key '${key}'`,
        )
      }
    }
  }

  const parameterValue = modelParams[parameterKey]

  const isDict = parameter.type === 'Dictionary'
  const hasSubparameters = parameter.parameters.length > 0
  const isRawDict = isDict && !hasSubparameters
  const isModel = isDict && !isRawDict
  const isModelList = isModel && parameter.multi

  if (isRawDict) {
    if (parameterValue === '') {
      return { [parameterKey]: null }
    }

    const parsedValue = JSON.parse(parameterValue as string)

    return { [parameterKey]: parsedValue }
  } else if (isModel || hasSubparameters) {
    let fixedSubParameters = {} as ObjectWithStringKeys

    if (isModelList) {
      if (!Array.isArray(parameterValue)) {
        throw new Error(`Model has non-array value for key '${parameterKey}'`)
      }

      const parameterValues = parameterValue as ObjectWithStringKeys[]
      const fixedSubParametersArray = [] as ObjectWithStringKeys[]

      for (const value of parameterValues) {
        for (const subParameter of parameter.parameters) {
          const subParameterKey = key + '.' + subParameter.key
          const fixedSubParameter = fixDictionary(
            value,
            subParameter,
            subParameterKey,
          )

          fixedSubParameters = {
            ...fixedSubParameters,
            ...fixedSubParameter,
          }
        }
        fixedSubParametersArray.push(fixedSubParameters)
        fixedSubParameters = {}
      }

      return { [parameterKey]: fixedSubParametersArray }
    } else {
      for (const subParameter of parameter.parameters) {
        const subParameterKey = key + '.' + subParameter.key
        const fixedSubParameter = fixDictionary(
          parameterValue as ObjectWithStringKeys,
          subParameter,
          subParameterKey,
        )

        fixedSubParameters = {
          ...fixedSubParameters,
          ...fixedSubParameter,
        }
      }

      fixedSubParameters = {
        ...(parameterValue as ObjectWithStringKeys),
        ...fixedSubParameters,
      }

      const returnValue = { [parameterKey]: fixedSubParameters }

      return returnValue
    }
  } else {
    const returnValue = { [parameterKey]: parameterValue }

    return returnValue
  }
}

const parseAny = (value: string): string | number | boolean | null | object => {
  if (value === '') {
    return null
  }

  return JSON.parse(value)
}

const fixAny = (
  modelParams: ObjectWithStringKeys,
  parameter: Parameter,
  key = '',
) => {
  const parameterKey = parseKey(key, parameter)

  if (!(parameterKey in modelParams)) {
    if (parameter.nullable) {
      return parameter.multi
        ? { [parameterKey]: [] }
        : {
            [parameterKey]: null,
          }
    } else if (parameter.optional || parameter.type === 'Bytes') {
      return null
    }

    throw new Error(
      `Received parameter model without needed key '${parameterKey}'`,
    )
  } else {
    if (parameter.optional) {
      if (typeof modelParams[parameterKey] === 'undefined') {
        return null
      }
    } else if (!parameter.multi) {
      if (typeof modelParams[parameterKey] === 'undefined') {
        throw new Error(
          `Received empty parameter value for non-optional key '${key}'`,
        )
      }
    }
  }

  const parameterValue = modelParams[parameterKey]

  const isAny = parameter.type === 'Any'
  const isMulti = parameter.multi
  const isAnyList = isAny && isMulti
  const hasSubparameters = parameter.parameters.length > 0

  if (isAny) {
    if (parameterValue === '') {
      return { [parameterKey]: null }
    }
    if (isAnyList) {
      if (!Array.isArray(parameterValue)) {
        throw new Error(`Model has non-array value for key '${parameterKey}'`)
      }

      const parameterValues = parameterValue as string[]
      const fixedSubParametersArray = parameterValues.map(parseAny)

      return { [parameterKey]: fixedSubParametersArray }
    } else {
      return { [parameterKey]: parseAny(parameterValue as string) }
    }
  } else if (hasSubparameters) {
    if (isMulti) {
      if (!Array.isArray(parameterValue)) {
        throw new Error(`Received non-array value for key '${parameterKey}'`)
      }

      let fixedSubParameters = {} as ObjectWithStringKeys
      const parameterValues = parameterValue as ObjectWithStringKeys[]
      const fixedSubParametersArray = [] as ObjectWithStringKeys[]

      for (const value of parameterValues) {
        for (const subParameter of parameter.parameters) {
          const subParameterKey = key + '.' + subParameter.key
          const fixedSubParameter = fixAny(value, subParameter, subParameterKey)

          fixedSubParameters = {
            ...fixedSubParameters,
            ...fixedSubParameter,
          }
        }
        fixedSubParametersArray.push(fixedSubParameters)
        fixedSubParameters = {}
      }

      return { [parameterKey]: fixedSubParametersArray }
    } else {
      let fixedSubParameters = {} as ObjectWithStringKeys

      for (const subParameter of parameter.parameters) {
        const subParameterKey = key + '.' + subParameter.key
        const fixedSubParameter = fixAny(
          parameterValue as ObjectWithStringKeys,
          subParameter,
          subParameterKey,
        )

        fixedSubParameters = {
          ...fixedSubParameters,
          ...fixedSubParameter,
        }
      }
      fixedSubParameters = {
        ...(parameterValue as ObjectWithStringKeys),
        ...fixedSubParameters,
      }

      const returnValue = { [parameterKey]: fixedSubParameters }

      return returnValue
    }
  }

  return { [parameterKey]: parameterValue }
}

const prepareModelForSubmit = (
  model: Job | RequestTemplate,
  parameters: Parameter[],
  isJob: boolean,
) => {
  let modelParams: ObjectWithStringKeys

  if (isJob) {
    modelParams = (model as Job).request_template.parameters
  } else {
    modelParams = (model as RequestTemplate).parameters
  }

  if (Object.keys(modelParams).length === 0) {
    return model
  }

  for (const parameter of parameters) {
    const key = parameter.key

    modelParams = {
      ...modelParams,
      ...fixDictionary(modelParams, parameter, key),
    }

    modelParams = {
      ...modelParams,
      ...fixAny(modelParams, parameter, key),
    }
  }

  if (isJob) {
    const requestTemplate: RequestTemplate = {
      ...(model as Job).request_template,
      parameters: modelParams,
    }
    return {
      ...model,
      request_template: requestTemplate,
    } as Job
  } else {
    return {
      ...model,
      parameters: modelParams,
    } as RequestTemplate
  }
}

export { prepareModelForSubmit }
