import { Instance } from 'types/backend-types'

const getInstanceUiSchema = (instances: Array<Instance>) => {
  return instances.length === 1
    ? { instance_names: { instance_name: { 'ui:readonly': true } } }
    : null
}

const getUiSchema = (instances: Array<Instance>) => {
  const baseUiSchema = {
    'ui:order': ['comment', 'instance_names', '*'],
    comment: {
      'ui:widget': 'textarea',
    },
  }

  return {
    ...baseUiSchema,
    ...getInstanceUiSchema(instances),
  }
}

export { getUiSchema }
