import { FormValidation } from '@rjsf/core'
import { Parameter } from 'types/backend-types'

import { getErrorField } from './validator-helpers'

/**
 * Create validators for the 'Any' type
 *
 * @param parameters An array of BG parameters
 * @param parent A string that indexes the field's parent
 * @returns An array of validators for BG's 'Any' type
 */
const getAnyValidators = (
  parameters: Array<Parameter>,
  parent = 'parameters',
) => {
  const validators = []

  for (const parameter of parameters) {
    const [type, nullable, multi] = [
      parameter.type,
      parameter.nullable,
      parameter.multi,
    ]
    const parameterKey = parent + '.' + parameter.key

    if (type === 'Any') {
      if (!multi) {
        validators.push(
          <T extends Record<string, unknown>>(
            formData: T,
            errors: FormValidation,
          ) => {
            const value = parameterKey
              .split('.')
              .reduce((a: T, b: string) => a[b] as T, formData) as unknown
            const theValue = value as string | undefined
            const errorField = getErrorField(parameterKey, errors)

            if (theValue !== undefined) {
              try {
                const parsedValue = JSON.parse(theValue)

                if (!nullable && parsedValue === null) {
                  errorField.addError('May not be null')
                }
              } catch {
                errorField.addError('Entry must be conformant JSON')
              }
            }

            return errors
          },
        )
      } else {
        validators.push(
          <T extends Record<string, unknown>>(
            formData: T,
            errors: FormValidation,
          ) => {
            const values = parameterKey
              .split('.')
              .reduce((a: T, b: string) => a[b] as T, formData) as unknown
            const errorField = getErrorField(parameterKey, errors)

            if (!Array.isArray(values)) {
              throw new Error('Did not receive an Array, cannot continue')
            }

            values.forEach((value, index) => {
              try {
                const parsedValue = JSON.parse(value as string)

                if (!nullable && parsedValue === null) {
                  errorField[index].addError('May not be null')
                }
              } catch {
                errorField[index].addError('Entry must be conformant JSON')
              }
            })

            return errors
          },
        )
      }
    }

    validators.concat(getAnyValidators(parameter.parameters, parameterKey))
  }

  return validators
}

export { getAnyValidators }
