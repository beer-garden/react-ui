import { Checkbox, FormControlLabel, FormHelperText } from '@mui/material'
import { RegisterOptions, useFormContext } from 'react-hook-form'

interface FormCheckboxProps {
    registerKey: string
    registerOptions?: RegisterOptions
    disabled?: boolean
    label: string
    helperText?: string
}

const FormCheckbox = ({ registerKey, registerOptions, disabled, helperText, label }: FormCheckboxProps) => {
  const { register, getFieldState, watch } = useFormContext()
  const watchField = watch(registerKey)
  const { error } = getFieldState(registerKey)

  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            checked={watchField || false}
            size="small"
            color="secondary"
            {...register(registerKey, registerOptions )}
          />
        }
        disabled={disabled}
        label={label}
      />
      {(helperText || error) &&
        <FormHelperText sx={{mt: -1, pl: 2}} id={`${registerKey}-helperText`} error={!!error}>
          {error?.message? error.message : helperText}
        </FormHelperText>
      }
    </>
  )
}

export { FormCheckbox }