import {
  hasType,
  isControl,
  JsonSchema,
  rankWith,
  resolveSchema,
  Tester,
  UISchemaElement,
} from '@jsonforms/core'
import isEmpty from 'lodash/isEmpty'

const schemaMatches =
  (predicate: (schema: JsonSchema) => boolean): Tester =>
  (uischema: UISchemaElement, schema: JsonSchema): boolean => {
    if (isEmpty(uischema) || !isControl(uischema)) {
      return false
    }
    if (isEmpty(schema)) {
      return false
    }
    const schemaPath = uischema.scope
    if (isEmpty(schema)) {
      return false
    }
    if (uischema.options) {
      if (uischema.options.customRender === 'dictAnyForm') {
        return true
      }
    }
    let currentDataSchema = schema
    if (
      hasType(schema, 'number') &&
      hasType(schema, 'boolean') &&
      hasType(schema, 'array') &&
      hasType(schema, 'object') &&
      hasType(schema, 'string')
    ) {
      currentDataSchema = resolveSchema(schema, schemaPath)
    }
    if (currentDataSchema === undefined) {
      return false
    }

    return predicate(currentDataSchema)
  }

const dictAnyTester = (): Tester =>
  schemaMatches(
    (schema) =>
      !isEmpty(schema) &&
      hasType(schema, 'number') &&
      hasType(schema, 'boolean') &&
      hasType(schema, 'array') &&
      hasType(schema, 'object') &&
      hasType(schema, 'string')
  )

export default rankWith(
  100, //increase rank as needed
  dictAnyTester()
)
