import {
  ChoiceType,
  CommandBasicSchema,
  CommonSchema,
  Format,
  getParameterType,
  InstanceNamesTitleType,
  lookupChoiceType,
  lookupType,
  ParameterAsProperty,
  ParameterBasicCommonSchema,
  ParameterEmptySchema,
  ParameterSchema,
  ParameterSchemaDefault,
  ParametersPlain,
  ParametersWithMultiSchema,
  ParameterWithChoicesSchema,
  ParameterWithMultiDefault,
  ParameterWithMultiItemsType,
  ParameterWithSubParametersMultiSchema,
  ParameterWithSubParametersNoMultiSchema,
  ParameterWithSubParametersSchema,
  SchemaInstanceType,
} from 'formHelpers'
import { Instance, Parameter, ParameterType } from 'types/backend-types'

type StrippedParameter = Omit<Parameter, 'key'>

const getFormat = (arg: ParameterType): Format | null => {
  if (arg === 'Date') return { format: 'date' }
  if (arg === 'DateTime') return { format: 'date-time' }
  if (arg === 'Bytes') return { format: 'data-url' }

  return null
}

const getCommonResult = (
  parameter: StrippedParameter,
): ParameterBasicCommonSchema => {
  let theDefault: ParameterSchemaDefault | null = parameter.choices
    ? {
        default:
          'default' in parameter && parameter.default
            ? (parameter.default as
                | string[]
                | string
                | boolean
                | number
                | object)
            : '',
      }
    : null

  if (!parameter.choices) {
    if (parameter.type === 'Any' || parameter.type === 'Dictionary') {
      if (parameter.default) {
        if (Array.isArray(parameter.default)) {
          const theDefaults: string[] = []
          for (const value of Array.from(parameter.default)) {
            theDefaults.push(JSON.stringify(value))
          }

          theDefault = { default: theDefaults }
        } else {
          theDefault = { default: JSON.stringify(parameter.default) }
        }
      } else if (!parameter.optional) {
        if (parameter.nullable) {
          if (parameter.multi) {
            theDefault = { default: ['null'] }
          } else {
            theDefault = { default: 'null' }
          }
        } else {
          if (parameter.multi) {
            theDefault = { default: ['{}'] }
          } else {
            theDefault = { default: '{}' }
          }
        }
      } else {
        if (parameter.multi) {
          theDefault = { default: [] }
        } else {
          theDefault = { default: '{}' }
        }
      }
    } else if (
      'default' in parameter &&
      (parameter.default || parameter.type === 'Boolean')
    ) {
      if (parameter.type === 'Boolean') {
        if (parameter.optional) {
          const maybeDefault = parameter.default as boolean | undefined

          if (typeof maybeDefault !== 'undefined') {
            theDefault = {
              default: Boolean(parameter.default),
            }
          }
        }
      } else if (parameter.type !== 'Bytes') {
        theDefault = {
          default: parameter.default as string | number | object,
        }
      } else {
        theDefault = {
          default: parameter.default as string | number | boolean | object,
        }
      }
    }
  } else {
    if (parameter.type === 'Dictionary') {
      theDefault = {
        default: '',
      }
    }
  }

  return {
    type: getParameterType(parameter.type, parameter.nullable, parameter.multi),
    title: parameter.display_name,
    description: parameter.description ?? '',
    ...(theDefault as ParameterSchemaDefault),
  }
}

const extractSubParameters = (
  parameter: StrippedParameter,
): ParameterWithSubParametersSchema => {
  /* 'multi' can be true or not; we ignore 'choices' */
  const baseResult = getCommonResult(parameter)

  if (parameter.multi) {
    const withMulti: ParameterWithSubParametersMultiSchema = {
      ...baseResult,
      type: 'array',
      items: { ...getParameterSchema(parameter.parameters) },
    }
    return withMulti
  } else {
    const withoutMulti: ParameterWithSubParametersNoMultiSchema = {
      ...baseResult,
      ...getParameterSchema(parameter.parameters),
    }
    return withoutMulti
  }
}

const extractChoices = (
  parameter: StrippedParameter,
): ParameterWithChoicesSchema => {
  /* 'multi' can be true or not; we ignore subparameters */
  const choiceType = lookupChoiceType[parameter.type as ChoiceType]
  // TODO: this only handles arrays; need objects and strings too (?)
  const choices = Array.isArray(parameter.choices?.value)
    ? new Set(parameter.choices?.value)
    : new Set([])
  const choiceArray = Array.from(choices)
  const emptyChoice = [''] as Array<string | number | object | null>

  const enumObject = { enum: emptyChoice.concat(choiceArray) }

  const baseResult = getCommonResult(parameter)

  if (parameter.multi) {
    return {
      ...baseResult,
      type: 'array',
      items: {
        type: choiceType,
        title: parameter.display_name,
        ...enumObject,
      },
    }
  } else {
    return {
      ...baseResult,
      type: choiceType,
      ...enumObject,
    }
  }
}

const extractMulti = (
  parameter: StrippedParameter,
): ParametersWithMultiSchema => {
  /* this assumes 'choices' in undefined and there are no subparameters */
  const baseResult = getCommonResult(parameter)
  let derivedDefault: ParameterWithMultiDefault | null = null

  if (parameter.type === 'String' && parameter.nullable) {
    derivedDefault = { default: '' }
  } else if (
    (parameter.type === 'Any' || parameter.type === 'Dictionary') &&
    parameter.nullable
  ) {
    derivedDefault = { default: 'null' }
  } else if (parameter.type === 'Boolean') {
    derivedDefault = { default: false }
  }
  const subType: ParameterWithMultiItemsType = parameter.nullable
    ? ['null', lookupType[parameter.type]]
    : lookupType[parameter.type]

  return {
    ...baseResult,
    type: 'array',
    items: {
      type: subType,
      title: parameter.display_name,
      ...(derivedDefault as ParameterWithMultiDefault),
    },
    /*
       maximum and minimum in this context mean the greatest or smallest
      number of allowed items
     */
    ...(parameter.maximum ? { maxItems: parameter.maximum } : null),
    ...(parameter.minimum ? { minItems: parameter.minimum } : null),
  }
}

const extractPlain = (parameter: StrippedParameter): ParametersPlain => {
  // this assumes no 'choices', no 'multi' and no subparameters
  const baseResult = getCommonResult(parameter)

  const plain: ParametersPlain = {
    ...baseResult,
    /*
       maximum and minimum in this context mean the greatest or smallest
      value allowed
     */
    ...(parameter.maximum && parameter.type === 'Integer'
      ? { maximum: parameter.maximum }
      : null),
    ...(parameter.minimum && parameter.type === 'Integer'
      ? { minimum: parameter.minimum }
      : null),
    /*
      maximum and minimum in this context mean the length of the input
     */
    ...(parameter.maximum && parameter.type === 'String'
      ? { maxLength: parameter.maximum }
      : null),
    ...(parameter.minimum && parameter.type === 'String'
      ? { minLength: parameter.minimum }
      : null),
    ...getFormat(parameter.type),
  }

  return plain
}

const extractProperties = (parameter: StrippedParameter) => {
  const hasSubParameters = parameter.parameters.length > 0
  const hasChoices = !(
    typeof parameter.choices === 'undefined' || parameter.choices === null
  )
  const isMulti = parameter.multi

  /* blow up if some assumed properties are not satisfied */
  if (hasSubParameters && hasChoices) {
    throw new Error(
      'Plugin implementation error: cannot have both sub-parameters and choices',
    )
  }

  let extractedProperties: object

  if (hasSubParameters) {
    extractedProperties = extractSubParameters(parameter)
  } else if (hasChoices) {
    extractedProperties = extractChoices(parameter)
  } else if (isMulti) {
    /* i.e. doesn't have sub params or choices */
    extractedProperties = extractMulti(parameter)
  } else {
    /* doesn't have sub params, choices or multi */
    extractedProperties = extractPlain(parameter)
  }

  return extractedProperties
}

const parametersToProperties = (
  parameters: Array<Parameter>,
): ParameterAsProperty => {
  /*
       From an array of Parameters, create an object by hoisting up each
       Parameter's 'key' value  to be a key in the resulting object. then set
       the value of that key to be a transformation of the remaining values
       of the Parameter.
    */
  return parameters.reduce((accumulator, parameter) => {
    const { key, ...rest } = parameter
    return { ...accumulator, [key]: { ...extractProperties(rest) } }
  }, {})
}

const getRequired = (parameters: Parameter[]) => {
  return parameters.filter((x) => !x.optional).map((x) => x.key)
}

const getParameterSchema = (parameters: Array<Parameter>): ParameterSchema => {
  /*
    Derive parameter schema -- factored into a function so that it can be
    reused by subparameters.
   */
  return {
    type: 'object',
    properties: parametersToProperties(parameters),
    required: getRequired(parameters),
  }
}

const getSchema = (
  instances: Array<Instance>,
  parameters: Array<Parameter>,
) => {
  let instancesData: SchemaInstanceType | null = null

  if (instances.length > 1) {
    instancesData = { enum: instances.map((x) => x.name) }
  } else {
    instancesData = { default: instances[0].name }
  }

  const commonSchema: CommonSchema = {
    comment: {
      title: 'Comment',
      type: 'object',
      properties: {
        comment: {
          title: 'Comment',
          type: 'string',
          maxLength: 140,
          validationMessage: 'Maximum comment length is 140 characters',
        },
      },
    },
    instance_names: {
      title: ('Instance' +
        (instances.length > 1 ? 's' : '')) as InstanceNamesTitleType,
      type: 'object',
      properties: {
        instance_name: {
          title: 'Instance Name',
          type: 'string',
          ...instancesData,
        },
      },
      ...(instances.length > 1 ? { required: ['instance_name'] } : null),
    },
  }

  const computedParameters =
    parameters.length === 0
      ? ({
          type: 'object',
          properties: {},
          required: [],
        } as ParameterEmptySchema)
      : getParameterSchema(parameters)

  const schema: CommandBasicSchema = {
    type: 'object',
    properties: {
      ...commonSchema,
      parameters: {
        title: 'Parameters',
        ...computedParameters,
      },
    },
  }

  return schema
}

export { getSchema }
