import { FormCheckbox } from 'components/FormComponents'
import { Parameter } from 'types/backend-types'

interface ParamCheckboxProps {
  parameter: Parameter
  registerKey: string
}

const ParamCheckbox = ({ parameter, registerKey }: ParamCheckboxProps) => {
  
  return (
    <FormCheckbox
      registerKey={registerKey}
      label={!parameter.multi ? parameter.display_name : ''}
      helperText={!parameter.multi ? parameter.description : ''}
      registerOptions={{required: parameter.optional ? false : `${parameter.display_name} is required`}}
    />
  )
}

export { ParamCheckbox }
