import { FormValidation } from '@rjsf/core'
import { Parameter } from 'types/backend-types'

import { getAnyValidators } from './get-any-validators'
import { getDictionaryValidators } from './get-dictionary-validators'
import { getIntegerValidators } from './get-integer-validators'

const getValidator = <T extends Record<string, unknown>>(
  parameters: Array<Parameter>,
) => {
  const validators = [
    getAnyValidators(parameters),
    getDictionaryValidators(parameters),
    getIntegerValidators(parameters),
  ]

  return (formData: T, errors: FormValidation) => {
    for (const validatorArray of validators) {
      for (const validator of validatorArray) {
        errors = validator(formData, errors)
      }
    }

    return errors
  }
}

export { getValidator }
