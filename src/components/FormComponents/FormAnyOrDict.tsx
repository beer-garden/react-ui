import { Clear } from '@mui/icons-material'
import { IconButton, InputAdornment, TextField, TextFieldProps } from '@mui/material'
import { defaultTextFieldProps } from 'components/FormComponents'
import { ChangeEvent } from 'react'
import { RegisterOptions, useFormContext } from 'react-hook-form'

export type FormAnyOrDictProps = {
  registerKey: string
  registerOptions?: RegisterOptions
} & TextFieldProps

const FormAnyOrDict = ({ registerKey, registerOptions, ...textFieldProps }: FormAnyOrDictProps) => {
  const { getFieldState, watch, setValue, register, setError, clearErrors } = useFormContext()

  register(registerKey, {...registerOptions})

  const currentValue = watch(registerKey)

  const { error, invalid } = getFieldState(registerKey)
  
  if(error){
    textFieldProps.error = true
    if(error.message) textFieldProps.helperText = error.message
  }

  const endAdornment = (
    <InputAdornment position="end">
      {!textFieldProps.disabled &&
        <IconButton
          onClick={() => {
            setValue(registerKey, undefined)
          }}
        >
          <Clear />
        </IconButton>
      }
    </InputAdornment>
  )
  if (textFieldProps.InputProps && !textFieldProps.disabled) textFieldProps.InputProps.endAdornment = endAdornment
  else textFieldProps.InputProps = {
    endAdornment: endAdornment
  }

  return (
    <TextField
      {...defaultTextFieldProps}
      {...textFieldProps}
      value={ currentValue === undefined ? '' : ( invalid ? currentValue : JSON.stringify(currentValue))}
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        if(event.target.value === '') {
            clearErrors(registerKey)
            setValue(registerKey, undefined)
        }
        else try {
            const value = JSON.parse(event.target.value)
            if( textFieldProps.type === 'any' || typeof value === 'object' ) {
                setValue(registerKey, value)
                clearErrors(registerKey)
            } else throw new Error('value is not valid')
        } catch(e) {
            if(event.target.value !== ''){
                setError(registerKey, {
                type: 'parseError', 
                message: textFieldProps.type === 'object' ? 
                    'Invalid object'
                    :
                    'Unknown Type. Remember, variant fields must be enclosed with {} (object), [] (array), or "" (string).'
                })
            } else {
                clearErrors(registerKey)
            }
            setValue(registerKey, event.target.value)
        }
      }}
    />
  )
}

export { FormAnyOrDict }
