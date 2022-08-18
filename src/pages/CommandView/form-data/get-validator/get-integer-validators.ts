import { FormValidation } from '@rjsf/core'
import { Parameter } from 'types/backend-types'

import { getErrorField } from './validator-helpers'

const getIntegerValidators = (
  parameters: Array<Parameter>,
  parent = 'parameters',
) => {
  const validators = []

  for (const parameter of parameters) {
    const [type, nullable, multi, optional] = [
      parameter.type,
      parameter.nullable,
      parameter.multi,
      parameter.optional,
    ]
    const parameterKey = parent + '.' + parameter.key

    if (type === 'Integer') {
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
                const isInteger = Number.isInteger(parsedValue)

                if (!nullable && parsedValue === null) {
                  errorField.addError('May not be null')
                } else if (!optional && parsedValue === null) {
                  errorField.addError('May not be empty')
                } else if (theValue !== null && !isInteger) {
                  errorField.addError('Must be an integer')
                }
              } catch {
                errorField.addError('Must be an integer')
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
                const isInteger = Number.isInteger(parsedValue)

                if (!nullable && parsedValue === null) {
                  errorField[index].addError('May not be null')
                } else if (!optional && parsedValue === null) {
                  errorField[index].addError('May not be empty')
                } else if (value !== null && !isInteger) {
                  errorField[index].addError('Must be an integer')
                }
              } catch {
                errorField[index].addError('Must be an integer')
              }
            })

            return errors
          },
        )
      }
    }

    validators.concat(getIntegerValidators(parameter.parameters, parameterKey))
  }

  return validators
}

export { getIntegerValidators }
