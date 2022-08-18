import { Parameter } from 'types/backend-types'

import { getModel } from './get-model'

describe('basics', () => {
  test('simple parameter', () => {
    const model = getModel([simpleParameter])

    expect(model).toHaveProperty('parameters.aKey')
  })

  test('with nullable and no default', () => {
    const model = getModel([parameterNullableNoDefault()])
    console.log(JSON.stringify(model, undefined, 2))

    expect(model).toHaveProperty('parameters.aKey')
    expect(model).toMatchObject({
      parameters: {
        aKey: null,
      },
    })
  })

  test('with subparameters and no default', () => {
    const model = getModel([parameterWithSubparametersNoDefault()])

    expect(model).toHaveProperty('parameters.aKey.anotherKey')
  })
})

const simpleParameter: Parameter = {
  key: 'aKey',
  type: 'String',
  multi: false,
  display_name: 'display_name',
  optional: true,
  default: 'default',
  description: 'description',
  choices: undefined,
  parameters: [],
  nullable: false,
  maximum: undefined,
  minimum: undefined,
  regex: undefined,
  form_input_type: undefined,
  type_info: {},
}

const parameterNullableNoDefault = (): Parameter => {
  const { default: string, ...withoutDefault } = simpleParameter
  return {
    ...withoutDefault,
    nullable: true,
  }
}

const parameterWithSubparametersNoDefault = () => {
  const { default: string, ...withoutDefault } = simpleParameter
  return {
    ...withoutDefault,
    parameters: [
      { ...simpleParameter, key: 'anotherKey', default: 'aDifferentDefault' },
    ],
  }
}
