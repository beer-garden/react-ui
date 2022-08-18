import { Parameter } from 'types/backend-types'

type ParameterModel = {
  [key: string]: string | number | boolean | object | null
}

const mergeModels = (a: object, b: object) => {
  const result: ParameterModel | Record<string, never> = { ...a }

  for (const [key, value] of Object.entries(b)) {
    if (key in result) {
      result[key] = mergeModels(result[key] as object, value)
    } else {
      result[key] = value
    }
  }

  return result
}

const anyDefault = (arg: number | boolean | string | object | null): string => {
  if (typeof arg === 'string') {
    return `"${arg}"`
  }
  return JSON.stringify(arg)
}

const parameterMapper = (parameter: Parameter) => {
  let model: ParameterModel | Record<string, never> = {}
  const key = parameter.key

  if (parameter.nullable && !parameter.optional) {
    model = { [key]: null }
  } else if (parameter.multi) {
    model = { [key]: [] }
  }

  if ('default' in parameter) {
    if (parameter.type === 'Any' || parameter.type === 'Dictionary') {
      if (parameter.default) {
        if (parameter.multi) {
          if (Array.isArray(parameter.default)) {
            model = { [key]: Array.from(parameter.default).map(anyDefault) }
          } else {
            model = { [key]: [anyDefault(parameter.default)] }
          }
        } else {
          if (Array.isArray(parameter.default)) {
            model = { [key]: Array.from(parameter.default).map(anyDefault) }
          } else {
            model = { [key]: anyDefault(parameter.default) }
          }
        }
      } else if (!parameter.optional) {
        if (parameter.nullable) {
          if (parameter.multi) {
            model = { [key]: ['null'] }
          } else {
            model = { [key]: 'null' }
          }
        } else {
          if (parameter.multi) {
            model = { [key]: ['{}'] }
          } else {
            model = { [key]: '{}' }
          }
        }
      }
    }
    if (parameter.default !== null) {
      if (parameter.type === 'Any') {
        const theDefault = Array.isArray(parameter.default)
          ? Array.from(parameter.default).map(anyDefault)
          : String(parameter.default)
        model = { [key]: theDefault }
      } else if (parameter.type === 'Dictionary') {
        model = { [key]: JSON.stringify(parameter.default) }
      } else if (parameter.type === 'Boolean') {
        model = { [key]: Boolean(parameter.default) }
      } else {
        model = { [key]: parameter.default as string | number }
      }
    } else {
      if (parameter.type === 'Boolean') {
        model = { [key]: false }
      }
    }
  }

  if (parameter.parameters.length > 0) {
    const subParams: object = getParametersModel(parameter.parameters)

    if (key in model && model.key) {
      model = { [key]: mergeModels(model, subParams) }
    } else {
      if (!parameter.nullable) {
        if (parameter.multi) {
          model[key] = [subParams]
        } else {
          model[key] = subParams
        }
      }
    }
  }

  return model
}

const getParametersModel = (parameters: Array<Parameter>) => {
  return parameters.map(parameterMapper).reduce((result, current) => {
    for (const key in current) {
      if (Object.hasOwn(current, key)) {
        result[key] = current[key]
      }
    }
    return result
  }, {})
}

const getModel = (parameters: Array<Parameter>) => {
  const parameterModel = getParametersModel(parameters)

  return { parameters: parameterModel }
}

export { getModel }
