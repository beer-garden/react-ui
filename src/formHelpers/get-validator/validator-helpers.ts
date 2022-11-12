import { FormValidation } from '@rjsf/core'

const getErrorField = (parameterKey: string, rjsfErrors: FormValidation) => {
  return parameterKey
    .split('.')
    .reduce(
      (a: FormValidation, b: string) => a[b] as FormValidation,
      rjsfErrors,
    )
}

export { getErrorField }
