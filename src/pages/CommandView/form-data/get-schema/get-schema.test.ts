import { Instance, Parameter } from 'types/backend-types'

import { getSchema } from './get-schema'

describe('common properties', () => {
  test('result has properties', () => {
    const schema = getSchema(singleInstanceArray, [simpleParameter])

    expect(schema).toHaveProperty('properties')
  })

  test('comment is inserted into properties', () => {
    const schema = getSchema(singleInstanceArray, [simpleParameter])

    expect(schema).toHaveProperty('properties.comment')
    expect(schema).toHaveProperty('properties.comment.title')
    expect(schema).toHaveProperty('properties.comment.type')
    expect(schema).toHaveProperty('properties.comment.properties.comment')
    expect(schema).toHaveProperty('properties.comment.properties.comment.title')
    expect(schema).toHaveProperty('properties.comment.properties.comment.type')
    expect(schema).toHaveProperty(
      'properties.comment.properties.comment.maxLength',
    )
    expect(schema).toMatchObject({
      properties: {
        comment: {
          properties: {
            comment: {
              maxLength: 140,
            },
          },
        },
      },
    })
  })

  test('instance_name is inserted into properties', () => {
    const schema = getSchema(singleInstanceArray, [simpleParameter])

    expect(schema).toHaveProperty('properties.instance_names')
    expect(schema).toHaveProperty('properties.instance_names.title')
    expect(schema).toHaveProperty('properties.instance_names.type')
    expect(schema).toHaveProperty(
      'properties.instance_names.properties.instance_name',
    )
  })

  test('enum is ommitted from instance_name for single instance', () => {
    expect(
      getSchema(singleInstanceArray, [simpleParameter]),
    ).not.toHaveProperty('properties.instance_name.enum')
  })

  test('enum is present in instance_name for multiple instances', () => {
    const schema = getSchema(singleInstanceArray, [simpleParameter])
    const multiSchema = getSchema(multiInstanceArray, [simpleParameter])

    expect(schema).toHaveProperty('properties.instance_names')
    expect(schema).toHaveProperty('properties.instance_names.title')
    expect(schema).toHaveProperty('properties.instance_names.type')
    expect(multiSchema).toHaveProperty(
      'properties.instance_names.properties.instance_name.enum',
    )
    expect(multiSchema).toMatchObject({
      properties: {
        instance_names: {
          properties: {
            instance_name: {
              enum: expect.arrayContaining(['instance1', 'instance2']),
            },
          },
        },
      },
    })
  })

  test('parameter keys are hoisted into properties correctly', () => {
    const singleParameterSchema = getSchema(singleInstanceArray, [
      simpleParameter,
    ])

    expect(singleParameterSchema).toMatchObject({
      properties: {
        parameters: {
          properties: {
            aKey: expect.any(Object),
          },
        },
      },
    })

    const multiParameterSchema = getSchema(singleInstanceArray, [
      simpleParameter,
      anotherSimpleParameter,
    ])

    expect(multiParameterSchema).toMatchObject({
      properties: {
        parameters: {
          properties: {
            anotherKey: expect.any(Object),
          },
        },
      },
    })
  })

  test('simpleparameter default translated to default in schema', () => {
    const schema = getSchema(singleInstanceArray, [simpleParameter])

    expect(schema).toHaveProperty(
      'properties.parameters.properties.aKey.default',
    )
    expect(schema).toMatchObject({
      properties: {
        parameters: {
          properties: {
            aKey: {
              default: 'default',
            },
          },
        },
      },
    })
  })

  test('boolean default translated to default in schema correctly', () => {
    const schema = getSchema(singleInstanceArray, [
      {
        ...simpleParameter,
        type: 'Boolean',
        default: false,
      },
    ])

    expect(schema).toHaveProperty(
      'properties.parameters.properties.aKey.default',
    )
    expect(schema).toMatchObject({
      properties: {
        parameters: {
          properties: {
            aKey: {
              default: false,
            },
          },
        },
      },
    })
  })
})

describe('types', () => {
  test('Integer type is number', () => {
    const schema = getSchema(singleInstanceArray, [
      {
        ...simpleParameter,
        type: 'Integer',
      },
    ])

    expect(schema).toMatchObject({
      properties: {
        parameters: {
          properties: {
            aKey: {
              type: 'number',
            },
          },
        },
      },
    })
  })

  test('Float type is number', () => {
    const schema = getSchema(singleInstanceArray, [
      {
        ...simpleParameter,
        type: 'Float',
      },
    ])

    expect(schema).toMatchObject({
      properties: {
        parameters: {
          properties: {
            aKey: {
              type: 'number',
            },
          },
        },
      },
    })
  })

  test('String type is string', () => {
    const schema = getSchema(singleInstanceArray, [simpleParameter])

    expect(schema).toMatchObject({
      properties: {
        parameters: {
          properties: {
            aKey: {
              type: 'string',
            },
          },
        },
      },
    })
  })

  test('Boolean type is boolean', () => {
    const schema = getSchema(singleInstanceArray, [
      {
        ...simpleParameter,
        type: 'Boolean',
      },
    ])

    expect(schema).toMatchObject({
      properties: {
        parameters: {
          properties: {
            aKey: {
              type: 'boolean',
            },
          },
        },
      },
    })
  })

  test('Any type is string', () => {
    const schema = getSchema(singleInstanceArray, [
      {
        ...simpleParameter,
        type: 'Any',
      },
    ])

    expect(schema).toMatchObject({
      properties: {
        parameters: {
          properties: {
            aKey: {
              type: 'string',
            },
          },
        },
      },
    })
  })

  test('(raw) Dictionary type is string', () => {
    const schema = getSchema(singleInstanceArray, [
      {
        ...simpleParameter,
        type: 'Dictionary',
      },
    ])

    expect(schema).toMatchObject({
      properties: {
        parameters: {
          properties: {
            aKey: {
              type: 'string',
            },
          },
        },
      },
    })
  })
})

test('no parameters gets schema with empty properties and required', () => {
  const schema = getSchema(singleInstanceArray, [])

  expect(schema).toMatchObject({
    properties: {
      parameters: {
        properties: {},
        required: {},
      },
    },
  })
})

describe('parameter with subparameters and multi but no choices', () => {
  let schema: object, basicParameter: Parameter

  beforeAll(() => {
    const { default: theDefault, ...withoutDefault } = simpleParameter
    basicParameter = {
      ...withoutDefault,
      multi: true,
      parameters: [anotherSimpleParameter],
      choices: undefined,
    }
    schema = getSchema(singleInstanceArray, [basicParameter])
  })

  test('type is array', () => {
    expect(schema).toHaveProperty('properties.parameters.properties.aKey.type')
    expect(schema).toMatchObject({
      properties: {
        parameters: {
          properties: {
            aKey: {
              type: 'array',
            },
          },
        },
      },
    })
  })

  test('parameters.properties has populated items', () => {
    expect(schema).toHaveProperty('properties.parameters.properties.aKey.items')
    expect(schema).toMatchObject({
      properties: {
        parameters: {
          properties: {
            aKey: {
              items: {
                properties: {
                  anotherKey: expect.any(Object),
                },
              },
            },
          },
        },
      },
    })
  })

  test('only parameter type Dictionary creates raw_dict default', () => {
    const rawDictParameter: Parameter = {
      ...basicParameter,
      type: 'Dictionary',
      multi: false,
      parameters: [],
      optional: false,
      default: undefined,
    }

    const dictSchema = getSchema(singleInstanceArray, [rawDictParameter])

    expect(dictSchema).toHaveProperty(
      'properties.parameters.properties.aKey.default',
    )

    expect(schema).not.toHaveProperty(
      'properties.parameters.properties.aKey.default',
    )
    expect(dictSchema).toMatchObject({
      properties: {
        parameters: {
          properties: {
            aKey: {
              default: '{}',
            },
          },
        },
      },
    })
  })
})

describe('parameter with subparameters but no choices or multi', () => {
  let schema: object, basicParameter: Parameter

  beforeAll(() => {
    basicParameter = {
      ...simpleParameter,
      multi: false,
      parameters: [anotherSimpleParameter, thirdSimpleParameter],
      choices: undefined,
    }
    schema = getSchema(singleInstanceArray, [basicParameter])
  })

  test('type is object', () => {
    expect(schema).toHaveProperty('properties.parameters.properties.aKey.type')
    expect(schema).toMatchObject({
      properties: {
        parameters: {
          properties: {
            aKey: {
              type: 'object',
            },
          },
        },
      },
    })
  })

  test('parameters.properties top-level keys have populated properties', () => {
    expect(schema).toHaveProperty(
      'properties.parameters.properties.aKey.properties',
    )
    expect(schema).toMatchObject({
      properties: {
        parameters: {
          properties: {
            aKey: {
              properties: {
                anotherKey: expect.any(Object),
                thirdKey: expect.any(Object),
              },
            },
          },
        },
      },
    })
  })

  test('parameter type Dictionary creates raw_dict default', () => {
    const dictSchema = getSchema(singleInstanceArray, [
      {
        ...basicParameter,
        type: 'Dictionary',
        default: undefined,
      },
    ])

    expect(dictSchema).toHaveProperty(
      'properties.parameters.properties.aKey.default',
    )

    expect(dictSchema).toMatchObject({
      properties: {
        parameters: {
          properties: {
            aKey: {
              default: '{}',
            },
          },
        },
      },
    })
  })
})

describe('parameter with choices and multi but no subparameters', () => {
  let schema: object, basicParameter: Parameter

  beforeAll(() => {
    basicParameter = {
      ...simpleParameter,
      multi: true,
      parameters: [],
      choices: {
        display: 'select',
        strict: true,
        type: 'static',
        value: ['a', 'b', 'c'],
        details: {},
      },
    }
    schema = getSchema(singleInstanceArray, [basicParameter])
  })

  test('type is array', () => {
    expect(schema).toHaveProperty('properties.parameters.properties.aKey.type')
    expect(schema).toMatchObject({
      properties: {
        parameters: {
          properties: {
            aKey: {
              type: 'array',
            },
          },
        },
      },
    })
  })

  test('items is populated and correct', () => {
    expect(schema).toHaveProperty('properties.parameters.properties.aKey.items')
    expect(schema).toMatchObject({
      properties: {
        parameters: {
          properties: {
            aKey: {
              items: expect.any(Object),
            },
          },
        },
      },
    })
    expect(schema).toMatchObject({
      properties: {
        parameters: {
          properties: {
            aKey: {
              items: {
                type: 'string',
                enum: expect.any(Array),
              },
            },
          },
        },
      },
    })
  })

  test('raw_dict default is not created with choices', () => {
    const dictSchema = getSchema(singleInstanceArray, [
      {
        ...basicParameter,
        type: 'Dictionary',
      },
    ])

    expect(dictSchema).toMatchObject({
      properties: {
        parameters: {
          properties: {
            aKey: {
              default: '',
            },
          },
        },
      },
    })
  })
})

describe('parameter with choices but no multi and no subparameters', () => {
  let schema: object, basicParameter: Parameter

  beforeAll(() => {
    basicParameter = {
      ...simpleParameter,
      multi: false,
      parameters: [],
      choices: {
        display: 'select',
        strict: true,
        type: 'static',
        value: ['a', 'b', 'c'],
        details: {},
      },
    }
    schema = getSchema(singleInstanceArray, [basicParameter])
  })

  test('type of choices matches parameter type', () => {
    expect(schema).toHaveProperty('properties.parameters.properties.aKey.type')
    expect(schema).toMatchObject({
      properties: {
        parameters: {
          properties: {
            aKey: {
              type: 'string',
            },
          },
        },
      },
    })
  })

  test('enum falls directly under top-level key', () => {
    expect(schema).toHaveProperty('properties.parameters.properties.aKey.enum')
    expect(schema).toMatchObject({
      properties: {
        parameters: {
          properties: {
            aKey: {
              enum: expect.any(Array),
            },
          },
        },
      },
    })
  })

  test('raw_dict default is not created with choices', () => {
    const dictSchema = getSchema(singleInstanceArray, [
      {
        ...basicParameter,
        type: 'Dictionary',
      },
    ])

    expect(dictSchema).toMatchObject({
      properties: {
        parameters: {
          properties: {
            aKey: {
              default: '',
            },
          },
        },
      },
    })
  })
})

describe('parameter with multi but no choices and no subparameters', () => {
  let schema: object, basicParameter: Parameter

  beforeAll(() => {
    basicParameter = {
      ...simpleParameter,
      choices: undefined,
      multi: true,
      parameters: [],
    }
    schema = getSchema(singleInstanceArray, [basicParameter])
  })

  test('type of parameter is array', () => {
    expect(schema).toHaveProperty('properties.parameters.properties.aKey.type')
    expect(schema).toMatchObject({
      properties: {
        parameters: {
          properties: {
            aKey: {
              type: 'array',
            },
          },
        },
      },
    })
  })

  test('items falls directly under top-level key', () => {
    expect(schema).toHaveProperty('properties.parameters.properties.aKey.items')
    expect(schema).toMatchObject({
      properties: {
        parameters: {
          properties: {
            aKey: {
              items: expect.any(Object),
            },
          },
        },
      },
    })
  })

  test('raw_dict default is created with multi', () => {
    const dictSchema = getSchema(singleInstanceArray, [
      {
        ...basicParameter,
        type: 'Dictionary',
        multi: true,
        default: undefined,
      },
    ])

    expect(dictSchema).toHaveProperty(
      'properties.parameters.properties.aKey.default',
    )

    expect(dictSchema).toMatchObject({
      properties: {
        parameters: {
          properties: {
            aKey: {
              default: expect.any(Array),
            },
          },
        },
      },
    })
  })

  test('parameter maximum creates maxItem key', () => {
    schema = getSchema(singleInstanceArray, [
      {
        ...basicParameter,
        maximum: 2,
      },
    ])
    expect(schema).toHaveProperty(
      'properties.parameters.properties.aKey.maxItems',
    )
    expect(schema).toMatchObject({
      properties: {
        parameters: {
          properties: {
            aKey: {
              maxItems: expect.any(Number),
            },
          },
        },
      },
    })
  })

  test('parameter minimum creates minItem key', () => {
    schema = getSchema(singleInstanceArray, [
      {
        ...basicParameter,
        minimum: 2,
      },
    ])
    expect(schema).toHaveProperty(
      'properties.parameters.properties.aKey.minItems',
    )
    expect(schema).toMatchObject({
      properties: {
        parameters: {
          properties: {
            aKey: {
              minItems: expect.any(Number),
            },
          },
        },
      },
    })
  })
})

describe('parameter with no multi, no choices and no subparameters', () => {
  let schema: object, otherSchema: object, basicParameter: Parameter

  beforeAll(() => {
    basicParameter = {
      ...simpleParameter,
      multi: false,
      choices: undefined,
      parameters: [],
      default: undefined,
    }
    schema = getSchema(singleInstanceArray, [basicParameter])
    otherSchema = getSchema(singleInstanceArray, [
      {
        ...basicParameter,
        type: 'Integer',
      },
    ])
  })

  test('type of parameter is correct', () => {
    expect(schema).toHaveProperty('properties.parameters.properties.aKey.type')
    expect(otherSchema).toHaveProperty(
      'properties.parameters.properties.aKey.type',
    )
    expect(schema).toMatchObject({
      properties: {
        parameters: {
          properties: {
            aKey: {
              type: 'string',
            },
          },
        },
      },
    })
    expect(otherSchema).toMatchObject({
      properties: {
        parameters: {
          properties: {
            aKey: {
              type: 'number',
            },
          },
        },
      },
    })
  })

  test('only parameter type Dictionary creates raw_dict default', () => {
    const dictSchema = getSchema(singleInstanceArray, [
      {
        ...basicParameter,
        type: 'Dictionary',
      },
    ])

    expect(dictSchema).toHaveProperty(
      'properties.parameters.properties.aKey.default',
    )
    expect(schema).not.toHaveProperty(
      'properties.parameters.properties.aKey.default',
    )
    expect(dictSchema).toMatchObject({
      properties: {
        parameters: {
          properties: {
            aKey: {
              default: '{}',
            },
          },
        },
      },
    })
  })

  test('parameter maximum/minimum passed through for Integer', () => {
    const maxSchema = getSchema(singleInstanceArray, [
      { ...basicParameter, type: 'Integer', maximum: 20 },
    ])
    const minSchema = getSchema(singleInstanceArray, [
      { ...basicParameter, type: 'Integer', minimum: 20 },
    ])

    expect(maxSchema).toHaveProperty(
      'properties.parameters.properties.aKey.maximum',
    )
    expect(minSchema).toHaveProperty(
      'properties.parameters.properties.aKey.minimum',
    )
    expect(maxSchema).toMatchObject({
      properties: {
        parameters: {
          properties: {
            aKey: {
              maximum: expect.any(Number),
            },
          },
        },
      },
    })
    expect(minSchema).toMatchObject({
      properties: {
        parameters: {
          properties: {
            aKey: {
              minimum: expect.any(Number),
            },
          },
        },
      },
    })
  })

  test('parameter maximum/minimum becomes maxLength for String', () => {
    const maxSchema = getSchema(singleInstanceArray, [
      { ...basicParameter, type: 'String', maximum: 20 },
    ])
    const minSchema = getSchema(singleInstanceArray, [
      { ...basicParameter, type: 'String', minimum: 20 },
    ])

    expect(maxSchema).toHaveProperty(
      'properties.parameters.properties.aKey.maxLength',
    )
    expect(minSchema).toHaveProperty(
      'properties.parameters.properties.aKey.minLength',
    )
    expect(maxSchema).toMatchObject({
      properties: {
        parameters: {
          properties: {
            aKey: {
              maxLength: expect.any(Number),
            },
          },
        },
      },
    })
    expect(minSchema).toMatchObject({
      properties: {
        parameters: {
          properties: {
            aKey: {
              minLength: expect.any(Number),
            },
          },
        },
      },
    })
  })

  test('parameter with missing description gets empty description', () => {
    const { description, ...withoutDescription } = basicParameter
    const noDescriptionSchema = getSchema(singleInstanceArray, [
      withoutDescription,
    ])

    expect(noDescriptionSchema).toHaveProperty(
      'properties.parameters.properties.aKey.description',
    )

    expect(noDescriptionSchema).toMatchObject({
      properties: {
        parameters: {
          properties: {
            aKey: {
              description: '',
            },
          },
        },
      },
    })
  })

  describe('nullable', () => {
    let basicNullableParameter: Parameter
    let nullableSchema: object

    beforeAll(() => {
      basicNullableParameter = {
        ...basicParameter,
        nullable: true,
      }

      otherSchema = getSchema(singleInstanceArray, [
        {
          ...basicParameter,
          type: 'Integer',
        },
      ])
    })
    test('parameter nullable updates simple type to include null', () => {
      nullableSchema = getSchema(singleInstanceArray, [basicNullableParameter])

      expect(nullableSchema).toHaveProperty(
        'properties.parameters.properties.aKey.type',
      )
      expect(nullableSchema).toMatchObject({
        properties: {
          parameters: {
            properties: {
              aKey: {
                type: expect.arrayContaining(['string', 'null']),
              },
            },
          },
        },
      })
    })

    test('parameter nullable with type Any updates type to include null', () => {
      nullableSchema = getSchema(singleInstanceArray, [
        {
          ...basicNullableParameter,
          type: 'Any',
        },
      ])

      expect(nullableSchema).toHaveProperty(
        'properties.parameters.properties.aKey.type',
      )

      expect(nullableSchema).toMatchObject({
        properties: {
          parameters: {
            properties: {
              aKey: {
                type: expect.arrayContaining(['string', 'null']),
              },
            },
          },
        },
      })
    })
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

const [anotherSimpleParameter, thirdSimpleParameter] = [
  { ...simpleParameter, key: 'anotherKey' },
  { ...simpleParameter, key: 'thirdKey' },
]

const singleInstanceArray: Instance[] = [
  {
    name: 'instance1',
    description: 'description',
    id: 'id',
    status: 'status',
    status_info: {
      heartbeat: 1000,
    },
    queue_type: 'type',
    queue_info: {
      looks: 'good',
      to: 'me',
    },
    icon_name: 'icon_name',
    metadata: null,
  },
]

const multiInstanceArray: Instance[] = [
  ...singleInstanceArray,
  {
    ...singleInstanceArray[0],
    name: 'instance2',
  },
]
