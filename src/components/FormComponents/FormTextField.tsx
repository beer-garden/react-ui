import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment, MenuItem, TextField, TextFieldProps } from '@mui/material'
import { useMountedState } from 'hooks/useMountedState'
import { RegisterOptions, useFormContext } from 'react-hook-form'

type FormTextFieldProps = {
  registerKey: string
  registerOptions?: RegisterOptions
  menuOptions?: string[]
} & TextFieldProps

const FormTextField = ({ registerKey, registerOptions, menuOptions, ...textFieldProps }: FormTextFieldProps) => {
  const { register, getFieldState, getValues } = useFormContext()
  const [showPassword, setShowPassword] = useMountedState(false)
  const defaultTextFieldProps: TextFieldProps = {
    FormHelperTextProps: {
      sx: {ml: 0}
    },
    size:'small',
    fullWidth: true
  }

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

  return menuOptions ? (
    <TextField
      select
      {...defaultTextFieldProps}
      value={getValues(registerKey) || ''}
      {...textFieldProps}
      {...register(registerKey, registerOptions)}
    >
      {menuOptions.map((value) => <MenuItem key={value} value={value}>{value}</MenuItem>)}
    </TextField>
  ) : (
    <TextField {...defaultTextFieldProps} {...textFieldProps} type={showPassword ? 'string' : textFieldProps.type} {...register(registerKey, registerOptions)} />
  )
}

export { FormTextField }
