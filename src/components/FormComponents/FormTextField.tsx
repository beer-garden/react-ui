import { Visibility, VisibilityOff } from '@mui/icons-material'
import { IconButton, InputAdornment, MenuItem, TextField, TextFieldProps } from '@mui/material'
import { useMountedState } from 'hooks/useMountedState'
import { DateTime } from 'luxon'
import { RegisterOptions, useFormContext } from 'react-hook-form'

export type FormTextFieldProps = {
  registerKey: string
  registerOptions?: RegisterOptions
  menuOptions?: (string | number)[]
} & TextFieldProps

const defaultTextFieldProps: TextFieldProps = {
  FormHelperTextProps: {
    sx: {ml: 0}
  },
  size:'small',
  fullWidth: true,
  InputLabelProps: {shrink: true}
}

const FormTextField = ({ registerKey, registerOptions, menuOptions, ...textFieldProps }: FormTextFieldProps) => {
  const { register, getFieldState, watch, } = useFormContext()
  const [showPassword, setShowPassword] = useMountedState(false)

  const currentValue = watch(registerKey)

  const error = getFieldState(registerKey).error
  if(error){
    textFieldProps.error = true
    if(error.message) textFieldProps.helperText = error.message
  }

  if(textFieldProps.type === 'password'){
    const endAdornment = (
      <InputAdornment position="end">
        <IconButton
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <Visibility /> : <VisibilityOff />}
        </IconButton>
      </InputAdornment>
    )
    if (textFieldProps.InputProps) textFieldProps.InputProps.endAdornment = endAdornment
    else textFieldProps.InputProps = {
      endAdornment: endAdornment
    }
  }

  if(textFieldProps.type === 'datetime-local'){
    textFieldProps.value = currentValue ? DateTime.fromISO(new Date(currentValue).toISOString()).toISO().slice(0,-8) : ''
  } else if(textFieldProps.type === 'date'){
    textFieldProps.value = currentValue ? DateTime.fromISO(new Date(currentValue).toISOString()).toISO().slice(0,-14) : ''
  }

  return menuOptions ? (
    <TextField
      select
      {...defaultTextFieldProps}
      value={currentValue || ''}
      {...textFieldProps}
      {...register(registerKey, registerOptions)}
    >
      {menuOptions.map((value) => <MenuItem key={value} value={value}>{value}</MenuItem>)}
    </TextField>
  ) : (
    <TextField
      {...defaultTextFieldProps}
      value={(currentValue === 0 || currentValue) ? currentValue : ''}
      {...textFieldProps}
      {...register(registerKey, registerOptions)}
    />
  )
}

export { defaultTextFieldProps, FormTextField }
