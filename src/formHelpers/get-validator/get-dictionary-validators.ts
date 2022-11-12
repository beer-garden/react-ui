import { FormValidation } from '@rjsf/core'
import { Parameter } from 'types/backend-types'

import { getErrorField } from './validator-helpers'

const getDictionaryValidators = (
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
    const hasSubparameters = parameter.parameters.length > 0
    const parameterKey = parent + '.' + parameter.key

    if (type === 'Dictionary' && !hasSubparameters) {
      /*
            If a Dictionary parameter has subparameters, then defer to the
            validators for the subparameters. This is the case for test
            plugins with 'model' in their name.
         */
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
                } else if (theValue !== 'null' && !theValue.startsWith('{')) {
                  if (!optional) {
                    errorField.addError('Invalid object')
                  }
                }
              } catch {
                errorField.addError('Invalid object')
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
                } else if (value !== 'null' && !value.startsWith('{')) {
                  errorField.addError('Invalid object')
                }
              } catch {
                errorField[index].addError('Invalid object')
              }
            })

            return errors
          },
        )
      }
    }

    validators.concat(
      getDictionaryValidators(parameter.parameters, parameterKey),
    )
  }

  return validators
}

export { getDictionaryValidators }
