import { TFullSimpleParameter } from 'test/test-values'
import { Instance, Parameter } from 'types/backend-types'

import { getModel } from './get-model'

describe('basics', () => {
  const instances: Instance[] = [
    {
      name: 'instanceName',
      description: '',
      id: '',
      status: 'status',
      status_info: { heartbeat: 1 },
      queue_type: 'queueType',
    },
  ]
  test('simple parameter', () => {
    const model = getModel([TFullSimpleParameter], instances, false)

    expect(model).toHaveProperty('parameters.aKey')
  })

  test('with nullable and no default', () => {
    const model = getModel([parameterNullableNoDefault()], instances, false)

    expect(model).not.toHaveProperty('parameters.aKey')
  })

  test('with subparameters and no default', () => {
    const model = getModel(
      [parameterWithSubparametersNoDefault()],
      instances,
      false,
    )

    expect(model).toHaveProperty('parameters.aKey.anotherKey')
  })
})

const parameterNullableNoDefault = (): Parameter => {
  const { default: string, ...withoutDefault } = TFullSimpleParameter
  return {
    ...withoutDefault,
    nullable: true,
  }
}

const parameterWithSubparametersNoDefault = () => {
  const { default: string, ...withoutDefault } = TFullSimpleParameter
  return {
    ...withoutDefault,
    parameters: [
      {
        ...TFullSimpleParameter,
        key: 'anotherKey',
        default: 'aDifferentDefault',
      },
    ],
  }
}
