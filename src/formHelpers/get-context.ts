import { Parameter } from 'types/backend-types'
import { EmptyObject, ObjectWithStringKeys } from 'types/custom-types'

const getContext = (parameters: Parameter[]) => {
  let context: ObjectWithStringKeys | EmptyObject = {}

  for (const parameter of parameters) {
    if (parameter.choices && parameter.choices.display === 'typeahead') {
      context = {
        ...context,
        [parameter.key]: {
          choices: parameter.choices.value,
        },
      }
    }
  }

  return context
}

export { getContext }
