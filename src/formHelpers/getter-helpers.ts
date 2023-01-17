import { ParameterSchemaBasicType, ParameterSchemaType } from 'formHelpers'
import { ParameterType } from 'types/backend-types'

const lookupType: { [K in ParameterType]: ParameterSchemaBasicType } = {
  Base64: 'string',
  String: 'string',
  Float: 'number',
  Integer: 'number',
  Bytes: 'string',
  Dictionary: 'string',
  Date: 'string',
  DateTime: 'string',
  Boolean: 'boolean',
  Any: 'string', // we treat this as a special case
}

export type ChoiceType = 'String' | 'Float' | 'Integer' | 'Boolean'

const lookupChoiceType: Pick<typeof lookupType, ChoiceType> = {
  String: 'string',
  Float: 'number',
  Integer: 'number',
  Boolean: 'boolean',
}

const getParameterType = (
  type: ParameterType,
  nullable: boolean,
  multi: boolean,
): ParameterSchemaType => {
  if (multi) {
    if (nullable) {
      return ['array', 'null']
    }
    return 'array'
  }

  const resultType = lookupType[type]
  const computedType: ParameterSchemaType = nullable
    ? [resultType, 'null']
    : resultType

  return computedType
}

export { getParameterType, lookupChoiceType, lookupType }
