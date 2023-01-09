import {
  InstanceNameSchema,
  ParameterAsProperty,
  ParameterSchemaDefaultType,
  ParametersPlain,
  ParametersWithMultiSchema,
  ParameterWithChoicesArraySchema,
  ParameterWithChoicesNonArraySchema,
  ParameterWithChoicesSchema,
  ParameterWithSubParametersNoMultiSchema,
  ParameterWithSubParametersSchema,
} from 'formHelpers'
import {
  DynamicChoice,
  DynamicChoices,
  DynamicModel,
  isCommandChoiceWithArgs,
  ReadyStatus,
} from 'pages/CommandView/dynamic-form'
import { Instance, Parameter } from 'types/backend-types'

const isParameterWithChoicesArraySchema = (
  parameter:
    | ParameterWithChoicesArraySchema
    | ParameterWithChoicesNonArraySchema,
): parameter is ParameterWithChoicesArraySchema => {
  return (
    'type' in parameter &&
    parameter['type'] === 'array' &&
    'items' in parameter &&
    'enum' in parameter['items']
  )
}

const isParameterWithChoicesNonArraySchema = (
  parameter:
    | ParameterWithChoicesArraySchema
    | ParameterWithChoicesNonArraySchema,
): parameter is ParameterWithChoicesNonArraySchema => {
  return (
    'type' in parameter && parameter['type'] !== 'array' && 'enum' in parameter
  )
}

const isParameterWithChoicesSchema = (
  parameter:
    | ParameterWithSubParametersSchema
    | ParameterWithChoicesSchema
    | ParametersWithMultiSchema
    | ParametersPlain,
): parameter is ParameterWithChoicesSchema => {
  return (
    isParameterWithChoicesNonArraySchema(
      parameter as ParameterWithChoicesSchema,
    ) ||
    isParameterWithChoicesArraySchema(parameter as ParameterWithChoicesSchema)
  )
}

const extractParameterWithChoicesSchema = (
  parameterName: string,
  parameter: ParameterWithChoicesSchema,
) => {
  return {
    [parameterName]: parameter['default'],
  }
}

const isParametersWithMultiSchema = (
  parameter:
    | ParameterWithSubParametersSchema
    | ParameterWithChoicesSchema
    | ParametersWithMultiSchema
    | ParametersPlain,
): parameter is ParametersWithMultiSchema => {
  return (
    'type' in parameter &&
    parameter['type'] === 'array' &&
    'items' in parameter &&
    !('enum' in parameter['items'])
  )
}

const extractParametersWithMultiSchema = (
  parameterName: string,
  parameter: ParametersWithMultiSchema,
) => {
  return {
    [parameterName]: parameter.items.default,
  }
}

const isParameterWithSubParametersSchema = (
  parameter:
    | ParameterWithSubParametersSchema
    | ParameterWithChoicesSchema
    | ParametersWithMultiSchema
    | ParametersPlain,
): parameter is ParameterWithSubParametersSchema => {
  return (
    'type' in parameter &&
    parameter['type'] === 'object' &&
    'properties' in parameter
  )
}

const extractParameterWithSubParametersSchema = (
  parameterName: string,
  parameter: ParameterWithSubParametersSchema,
) => {
  if ('type' in parameter && parameter['type'] === 'array') {
    return {
      [parameterName]: [],
    }
  }

  return {
    [parameterName]: extractParameters(
      (parameter as ParameterWithSubParametersNoMultiSchema).properties,
    ),
  }
}

const extractPlainParameter = (
  parameterName: string,
  parameter: ParametersPlain,
) => {
  let theDefault = null
  try {
    theDefault = {
      [parameterName]: JSON.parse(
        JSON.stringify(parameter.default),
      ) as ParameterSchemaDefaultType,
    }
  } catch (e) {
    // no op
  }

  return theDefault
}

const extractParameters = (parameterSchema: ParameterAsProperty) => {
  let parameters = {}

  for (const parameterName in parameterSchema) {
    const parameterDetails = parameterSchema[parameterName]

    if (isParameterWithChoicesSchema(parameterDetails)) {
      parameters = {
        ...parameters,
        ...extractParameterWithChoicesSchema(parameterName, parameterDetails),
      }
    } else if (isParametersWithMultiSchema(parameterDetails)) {
      parameters = {
        ...parameters,
        ...extractParametersWithMultiSchema(parameterName, parameterDetails),
      }
    } else if (isParameterWithSubParametersSchema(parameterDetails)) {
      parameters = {
        ...parameters,
        ...extractParameterWithSubParametersSchema(
          parameterName,
          parameterDetails,
        ),
      }
    } else {
      parameters = {
        ...parameters,
        ...extractPlainParameter(parameterName, parameterDetails),
      }
    }
  }

  return parameters
}

const extractModel = (
  parameterSchema: ParameterAsProperty,
  instanceSchema: InstanceNameSchema,
): DynamicModel => {
  return {
    comment: '',
    instance_name: 'default' in instanceSchema ? instanceSchema.default : '',
    parameters: {
      ...extractParameters(parameterSchema),
    },
  }
}

const extractReady = (
  instances: Instance[],
  parameters: Parameter[],
): ReadyStatus => {
  let readyStatus: ReadyStatus =
    instances.length <= 1
      ? {}
      : {
          instance_name: {
            ready: false,
          },
        }

  for (const parameter of parameters) {
    if (
      ('default' in parameter && typeof parameter['default'] === 'undefined') ||
      !('default' in parameter)
    ) {
      readyStatus = {
        ...readyStatus,
        [parameter.key]: {
          ready: false,
        },
      }
    }
  }

  return readyStatus
}

const extractDynamicChoices = (
  parameters: Parameter[],
): [DynamicChoices, DynamicChoice] => {
  let dynamicChoices: DynamicChoices = {}
  let dynamicChoice: DynamicChoice = {}

  for (const parameter of parameters) {
    const choice = parameter.choices

    if (typeof choice !== 'undefined' && isCommandChoiceWithArgs(choice)) {
      dynamicChoices = {
        ...dynamicChoices,
        [parameter.key]: {
          enum: [''],
        },
      }
      dynamicChoice = {
        ...dynamicChoice,
        [parameter.key]: {
          choice: '',
        },
      }
    }
  }

  return [dynamicChoices, dynamicChoice]
}

export { extractDynamicChoices, extractModel, extractReady }
