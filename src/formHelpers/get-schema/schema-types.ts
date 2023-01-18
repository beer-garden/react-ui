import { JobPropertiesBasicSchema } from 'formHelpers'

interface SingleInstance {
  default: string
}
interface MultipleInstance {
  enum: string[]
}

export type SchemaInstanceType = SingleInstance | MultipleInstance

interface CommonInstanceName {
  title: 'Instance Name'
  type: 'string'
}

export type InstanceNameSchema = CommonInstanceName &
  (SingleInstance | MultipleInstance)

export type InstanceNamesTitleType = 'Instance' | 'Instances'

export interface CommonSchema {
  comment: {
    title: 'Comment'
    type: 'object'
    properties: {
      comment: {
        title: 'Comment'
        type: 'string'
        maxLength: number
        validationMessage: string
      }
    }
  }
  instance_names: {
    title: InstanceNamesTitleType
    type: 'object'
    properties: {
      instance_name: InstanceNameSchema
    }
    required?: ['instance_name']
  }
}

export type ParameterSchemaBasicType = 'string' | 'number' | 'boolean'
export type ParameterSchemaType =
  | 'object'
  | ['array', 'null']
  | 'array'
  | [ParameterSchemaBasicType, 'null']
  | ParameterSchemaBasicType

export type ParameterSchemaDefaultType =
  | string[]
  | string
  | boolean
  | number
  | object

export interface ParameterSchemaDefault {
  default: ParameterSchemaDefaultType
}

export interface ParameterBasicCommonSchema {
  type: ParameterSchemaType
  title: string
  description: string
  default: ParameterSchemaDefaultType
  id?: string
}

export type ParameterWithSubParametersMultiSchema =
  ParameterBasicCommonSchema & {
    type: 'array'
    items: ParameterSchema
  }

export type ParameterWithSubParametersNoMultiSchema =
  ParameterBasicCommonSchema & ParameterSchema

export type ParameterWithSubParametersSchema =
  | ParameterWithSubParametersMultiSchema
  | ParameterWithSubParametersNoMultiSchema

export type ParameterWithChoicesArraySchema = {
  type: 'array'
  items: {
    type: ParameterSchemaBasicType
    title: string
    enum: Array<string | number | object | null>
  }
}

export type ParameterWithChoicesNonArraySchema = {
  type: ParameterSchemaBasicType
  enum: Array<string | number | object | null>
}

export type ParameterWithChoicesSchema = ParameterBasicCommonSchema &
  (ParameterWithChoicesArraySchema | ParameterWithChoicesNonArraySchema)

export type ParameterWithMultiItemsType =
  | ['null', ParameterSchemaBasicType]
  | ParameterSchemaBasicType

type ParameterWithMultiDefaultType = '' | 'null' | false

export interface ParameterWithMultiDefault {
  default: ParameterWithMultiDefaultType
}

export type ParametersWithMultiSchema = ParameterBasicCommonSchema & {
  type: 'array'
  items: {
    type: ParameterWithMultiItemsType
    title: string
    default: '' | 'null' | false
    maxItems?: number
    minItems?: number
  }
}

export type FormatType = 'date' | 'date-time' | 'data-url'

export interface Format {
  format?: FormatType
}

export type ParametersPlain = ParameterBasicCommonSchema &
  (
    | {
        maximum?: number
        minimum?: number
      }
    | {
        maxLength?: number
        minLength?: number
      }
  ) &
  Format

export interface ParameterAsProperty {
  [key: string]:
    | ParameterWithSubParametersSchema
    | ParameterWithChoicesSchema
    | ParametersWithMultiSchema
    | ParametersPlain
}

export interface ParameterNonEmptySchema {
  type: 'object'
  properties: ParameterAsProperty
  required: string[]
}

export interface ParameterEmptySchema {
  type: 'object'
  properties: Record<string, never>
  required: []
}

export type ParameterSchema = ParameterNonEmptySchema | ParameterEmptySchema

export type CommandBasicPropertiesType = {
  parameters: {
    title: 'Parameters'
  } & ParameterSchema
} & CommonSchema

export interface CommandBasicSchema {
  type: 'object'
  properties: CommandBasicPropertiesType
}

export type JobPropertiesSchema = {
  properties: JobPropertiesBasicSchema & CommandBasicPropertiesType
}
