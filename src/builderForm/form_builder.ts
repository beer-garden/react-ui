import { UISchemaElement } from '@jsonforms/core'
import { buildParameters } from 'builderForm/build_parameter'
import { Command, System } from 'types/backend-types'
import { ObjectWithStringKeys } from 'types/custom-types'

export function formBuilder(
  system: System,
  command: Command,
): {
  schema: ObjectWithStringKeys
  uiSchema: UISchemaElement
  model: ObjectWithStringKeys
} {
  const instanceNames: (string | undefined)[] = [undefined]
  let instanceSchema

  const commonModel: { [key: string]: string } = {
    system: system.name,
    system_version: system.version,
    namespace: system.namespace,
    command: command.name,
    output_type: command.output_type,
  }

  if (system.instances.length === 1) {
    instanceSchema = {
      title: 'Instance Name',
      type: 'string',
    }
    commonModel['instance_name'] = system.instances[0].name
  } else if (system.instances.length > 1) {
    for (const instance of system.instances) {
      instanceNames.push(instance.name)
    }
    instanceSchema = {
      title: 'Instance Name',
      type: 'string',
      enum: instanceNames,
    }
  }

  const commonRequired = [
    'system',
    'system_version',
    'namespace',
    'instance_name',
    'command',
  ]

  const commonSchema = {
    system: {
      title: 'System Name',
      type: 'string',
    },
    system_version: {
      title: 'System Version',
      type: 'string',
    },
    namespace: {
      title: 'Namespace',
      type: 'string',
    },
    command: {
      title: 'Command Name',
      type: 'string',
    },
    comment: {
      title: 'Comment',
      type: 'string',
      maxLength: 140,
      validationMessage: 'Maximum comment length is 140 characters',
    },
    output_type: {
      title: 'Output Type',
      type: 'string',
    },
    instance_name: instanceSchema,
  }

  const systemLayout = {
    type: 'HorizontalLayout',
    rule: {
      effect: 'DISABLE',
      condition: {},
    },
    elements: [
      {
        type: 'Control',
        scope: '#/properties/system',
      },
      {
        type: 'Control',
        scope: '#/properties/system_version',
      },
      {
        type: 'Control',
        scope: '#/properties/command',
      },
      {
        type: 'Control',
        rule: {
          effect: 'ENABLE',
          condition: {
            scope: '#/properties/instance_name',
            schema: { enum: instanceNames },
          },
        },
        scope: '#/properties/instance_name',
        choices: { titleMap: instanceNames },
      },
    ],
  }

  const commentLayout = {
    type: 'Control',
    scope: '#/properties/comment',
    feedback: true,
    disableSuccessState: false,
    options: {
      multi: true,
    },
    disableErrorState: false,
    readonly: false,
    required: false,
    fieldHtmlClass: 'm-b-3',
  }

  const builtParam = buildParameters(command.parameters, 'parameters')

  const parametersLayout = {
    type: 'Categorization',
    elements: [
      {
        type: 'Category',
        label: 'Required Fields',
        elements: builtParam.requiredUiSchema,
      },
      {
        type: 'Category',
        label: 'Optional Fields',
        elements: builtParam.optionalUiSchema,
      },
    ],
  }
  const parametersModel = builtParam.model
  const parametersSchema = builtParam.schema

  const uiSchema = {
    type: 'VerticalLayout',
    elements: [parametersLayout, systemLayout, commentLayout],
  }

  const model = Object.assign({}, commonModel, parametersModel)
  const schema = {
    type: 'object',
    properties: Object.assign({}, commonSchema, parametersSchema),
    required: commonRequired,
  }

  return {
    schema: schema,
    uiSchema: uiSchema,
    model: model,
  }
}
