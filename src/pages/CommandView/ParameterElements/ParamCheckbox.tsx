import { FormCheckbox } from 'components/FormComponents'
import { useFormContext } from 'react-hook-form'
import { Parameter } from 'types/backend-types'

interface ParamCheckboxProps {
  parameter: Parameter
  registerKey: string
}

const ParamCheckbox = ({ parameter, registerKey }: ParamCheckboxProps) => {

  const { watch } = useFormContext()
  const value = watch(registerKey)
  
  return (
    <FormCheckbox
      registerKey={registerKey}
      label={!parameter.multi ? parameter.display_name : ''}
      helperText={!parameter.multi ? parameter.description : ''}
      registerOptions={{required: parameter.optional || value === false ? false : `${parameter.display_name} is required`}}
    />
  )
}

export { ParamCheckbox }
