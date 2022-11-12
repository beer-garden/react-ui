import { ParameterType } from 'types/backend-types'

const lookupType: { [K in ParameterType]: string } = {
  Base64: 'string', // TODO
  String: 'string',
  Float: 'number',
  Integer: 'number',
  Bytes: 'string', // TODO
  Dictionary: 'string',
  Date: 'string',
  DateTime: 'string',
  Boolean: 'boolean',
  Any: 'string', // we treat this as a special case
}

type ChoiceType = 'String' | 'Float' | 'Integer' | 'Boolean'

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
) => {
  if (multi) {
    if (nullable) {
      return ['array', 'null']
    }
    return 'array'
  }

  const resultType = lookupType[type]
  const computedType = nullable ? [resultType, 'null'] : resultType

  return computedType
}

export { type ChoiceType, getParameterType, lookupChoiceType, lookupType }
