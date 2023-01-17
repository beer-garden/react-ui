import { UiSchema } from '@rjsf/core'
import { Instance } from 'types/backend-types'
import { AugmentedCommand } from 'types/custom-types'

const getInstanceUiSchema = (instances: Array<Instance>) => {
  return instances.length === 1
    ? { instance_names: { instance_name: { 'ui:readonly': true } } }
    : null
}

const getUiSchema = (
  instances: Array<Instance>,
  command: AugmentedCommand,
): UiSchema => {
  const baseUiSchema = {
    'ui:order': ['comment', 'instance_names', '*'],
    comment: {
      'ui:widget': 'textarea',
    },
  }
  let parameterSchema = {}
  for (const param of command.parameters) {
    if (param.choices && param.choices.display === 'typeahead') {
      parameterSchema = {
        ...parameterSchema,
        [param.key]: {
          'ui:widget': 'TypeAheadChoices',
        },
      }
    }
  }

  return {
    ...baseUiSchema,
    parameters: {
      ...parameterSchema,
    },
    ...getInstanceUiSchema(instances),
  }
}

export { getUiSchema }
