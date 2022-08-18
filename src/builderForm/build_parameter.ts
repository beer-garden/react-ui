import { Parameter } from 'types/backend-types'
import { ObjectWithStringKeys } from 'types/custom-types'

function getTypeAndFormat(parameter: Parameter) {
  let parameterType: string | string[] = parameter.type.toLowerCase()
  let parameterFormat: string | undefined
  let parameterDefualt: string | undefined
  if (parameterType === 'float') {
    parameterType = 'number'
  } else if (parameterType === 'dictionary') {
    parameterType = 'object'
    parameterDefualt = 'raw_dict'
  } else if (parameterType === 'date') {
    parameterType = 'string'
    parameterFormat = 'date'
  } else if (parameterType === 'datetime') {
    parameterType = 'string'
    parameterFormat = 'date-time'
  } else if (parameterType === 'any') {
    parameterType = ['number', 'boolean', 'array', 'object', 'string']
  }
  let paramSubType: string | string[] | null = null
  if (parameter.multi) {
    paramSubType = parameterType
    parameterType = 'array'
  }
  if (parameter.nullable) {
    if (typeof parameterType === 'string') {
      parameterType = [parameterType, 'null']
    } else {
      parameterType.push('null')
    }
    if (parameter.multi && typeof paramSubType !== 'string' && paramSubType) {
      paramSubType.push('null')
    }
  }
  return {
    parameterType: parameterType,
    parameterFormat: parameterFormat,
    paramSubType: paramSubType,
    parameterDefualt: parameterDefualt,
  }
}

export function buildParameters(
  parameters: Parameter[],
  parentKey: string,
  scopeKey = '#/properties/',
): {
  schema: ObjectWithStringKeys
  model: ObjectWithStringKeys
  requiredUiSchema: ObjectWithStringKeys[]
  optionalUiSchema: ObjectWithStringKeys[]
} {
  scopeKey = scopeKey + parentKey + '/properties/'
  const schema: ObjectWithStringKeys = {}
  schema[parentKey] = {
    type: 'object',
    properties: {},
    required: [],
  }
  const model: ObjectWithStringKeys = {}
  model[parentKey] = {}
  const requiredUiSchema: ObjectWithStringKeys[] = []
  const optionalUiSchema: ObjectWithStringKeys[] = []

  for (const i in parameters) {
    const parameter = parameters[i]
    const key = parameter.key
    const scope = scopeKey + key
    const { parameterType, parameterFormat, paramSubType, parameterDefualt } =
      getTypeAndFormat(parameter)
    const paramBuild = buildParameters(parameter.parameters, key, scopeKey)
    schema[parentKey].properties[key] = {
      type: parameterType,
      title: parameter.display_name,
      description: parameter.description || '',
    }
    if (parameter.multi) {
      schema[parentKey].properties[key]['items'] = {
        type: paramSubType,
        title: parameter.display_name,
      }
      if (parameter.parameters.length) {
        schema[parentKey].properties[key].items['properties'] = Object.assign(
          {},
          paramBuild.schema[key].properties,
          schema[parentKey].properties[key].items.properties,
        )
        model[parentKey][key] = [paramBuild.model[key]]
        schema[parentKey].properties[key].items['required'] =
          paramBuild.schema[key].required
      } else if (parameter.choices) {
        schema[parentKey].properties[key].items['enum'] = Array.from(
          new Set(parameter.choices.value),
        )
      }

      if (!parameter.parameters.length) {
        model[parentKey][key] = []
      }

      if (parameter.maximum) {
        schema[parentKey].properties[key]['maxItems'] = parameter.maximum
      }
      if (parameter.minimum) {
        schema[parentKey].properties[key]['minItems'] = parameter.minimum
      }
    } else if (parameter.parameters.length) {
      schema[parentKey].properties[key] = paramBuild.schema[key]
      model[parentKey][key] = paramBuild.model[key]
    } else {
      if (parameter.choices) {
        schema[parentKey].properties[key]['enum'] = Array.from(
          new Set(parameter.choices.value),
        )
      }

      if (parameter.maximum) {
        if (parameterType.includes('string')) {
          schema[parentKey].properties[key]['maxLength'] = parameter.maximum
        }
        if (
          parameterType.includes('number') ||
          parameterType.includes('integer')
        ) {
          schema[parentKey].properties[key]['maximum'] = parameter.maximum
        }
      }
      if (parameter.minimum) {
        if (parameterType.includes('string')) {
          schema[parentKey].properties[key]['minLength'] = parameter.minimum
        }
        if (
          parameterType.includes('number') ||
          parameterType.includes('integer')
        ) {
          schema[parentKey].properties[key]['minimum'] = parameter.minimum
        }
      }
    }
    if (parameterFormat) {
      schema[parentKey].properties[key]['format'] = parameterFormat
    }
    if (parameterDefualt) {
      schema[parentKey].properties[key]['defualt'] = parameterDefualt
    }
    if (parameter.default) {
      model[parentKey][key] = parameter.default
    } else if (
      parameterType.includes('boolean') &&
      !parameter.nullable &&
      parameter.type.toLocaleLowerCase() !== 'any' &&
      !parameter.multi
    ) {
      model[parentKey][key] = false
    } else if (parameter.nullable) {
      model[parentKey][key] = null
    }

    const element: { [key: string]: { [key: string]: string } | string } = {
      type: 'Control',
      label: parameter.display_name,
      scope: scope,
    }
    if (
      'dictionary' === parameter.type.toLowerCase() &&
      !parameter.parameters.length
    ) {
      element['options'] = { customRender: 'dictAnyForm' }
    }
    if (parameter.optional) {
      optionalUiSchema.push(element)
    } else {
      schema[parentKey].required.push(key)
      requiredUiSchema.push(element)
    }
  }

  if (!requiredUiSchema.length) {
    requiredUiSchema.push({
      type: 'Control',
      scope: '#/properties/alert',
    })
  }
  if (!optionalUiSchema.length) {
    optionalUiSchema.push({
      type: 'Control',
      scope: '#/properties/alert',
    })
  }

  return {
    schema: schema,
    model: model,
    requiredUiSchema: requiredUiSchema,
    optionalUiSchema: optionalUiSchema,
  }
}
