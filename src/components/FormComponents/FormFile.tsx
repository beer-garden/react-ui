import { TextField, TextFieldProps } from '@mui/material'
import { defaultTextFieldProps } from 'components/FormComponents'
import { ChangeEvent } from 'react'
import { RegisterOptions, useFormContext } from 'react-hook-form'

export type FormFileProps = {
  registerKey: string
  registerOptions?: RegisterOptions
} & TextFieldProps

const FormFile = ({ registerKey, registerOptions, ...textFieldProps }: FormFileProps) => {
  const { getFieldState, watch, setValue, register, trigger } = useFormContext()

  const currentValue = watch(registerKey)

  register(registerKey, {...registerOptions})

  const { error } = getFieldState(registerKey)
  if(error){
    textFieldProps.error = true
    if(error.message) textFieldProps.helperText = error.message
  }

  return (
    <TextField
      {...defaultTextFieldProps}
      {...textFieldProps}
      type="file"
      value={currentValue !== '' && currentValue !== undefined ? currentValue.fileName : ''}
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        if(event.target.files) {
          setValue(registerKey, event.target.files[0])
        }
        else {
          setValue(registerKey, '')
        }
        trigger(registerKey)
      }}
    />
  )
}

export { FormFile }
