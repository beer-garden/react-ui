import { Clear, Visibility, VisibilityOff } from '@mui/icons-material'
import { IconButton, InputAdornment, MenuItem, TextField, TextFieldProps } from '@mui/material'
import { useMountedState } from 'hooks/useMountedState'
import { DateTime } from 'luxon'
import { RegisterOptions, useFormContext } from 'react-hook-form'

export type FormTextFieldProps = {
  registerKey: string
  registerOptions?: RegisterOptions
  menuOptions?: (string | number | null)[]
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
  const { register, getFieldState, watch, setValue } = useFormContext()
  const [showPassword, setShowPassword] = useMountedState(false)

  const currentValue = watch(registerKey)

  const error = getFieldState(registerKey).error
  if(error){
    textFieldProps.error = true
    if(error.message) textFieldProps.helperText = error.message
  }

  if(!menuOptions){
    const endAdornment = (
      <InputAdornment position="end">
        {textFieldProps.type === 'password' && 
          <IconButton
            onClick={() => setShowPassword(!showPassword)}
            sx={{mr: -2}}
          >
            {showPassword ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        }
        {!textFieldProps.disabled &&
          <IconButton
            onClick={() => setValue(registerKey, '')}
            sx={{mr: -2}}
          >
            <Clear />
          </IconButton>
        }
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
      {...textFieldProps}
      value={currentValue || ''}
      {...register(registerKey, registerOptions)}
    >
      {menuOptions.map((value, index) => (
        <MenuItem key={`${registerKey}-${value === null ? JSON.stringify(value) : value}-${index}`} value={value as string | number}>
          {value === null ? JSON.stringify(value) : value}
        </MenuItem>
      ))}
    </TextField>
  ) : (
    <TextField
      {...defaultTextFieldProps}
      value={(currentValue === 0 || currentValue) ? currentValue : ''}
      {...textFieldProps}
      type={showPassword ? 'string' : textFieldProps.type}
      {...register(registerKey, registerOptions)}
    />
  )
}

export { defaultTextFieldProps, FormTextField }
