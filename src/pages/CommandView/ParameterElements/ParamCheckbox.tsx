import { Checkbox, FormControlLabel, FormHelperText } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { Parameter } from 'types/backend-types'

interface ParamCheckboxProps {
  parameter: Parameter
  registerKey: string
}

const ParamCheckbox = ({ parameter, registerKey }: ParamCheckboxProps) => {
  const { register, getValues, getFieldState } = useFormContext()
  const { error } = getFieldState(registerKey)
  
  return (
    <>
      <FormControlLabel
        sx={{my: -1}}
        control={
          <Checkbox
            checked={getValues(registerKey)}
            size="small"
            {...register(`${registerKey}`, { required: parameter.optional ? false : `${parameter.display_name} is required` })}
          />
        }
        label={ !parameter.multi && parameter.display_name }
      />
      {!parameter.multi && parameter.description && 
        <FormHelperText sx={{mt: -2}} id={`${registerKey}-helperText`}>
          {error? error.message : parameter.description}
        </FormHelperText>
      }
    </>
  )
}

export { ParamCheckbox }
