import { TextField } from '@mui/material'
import { useFormikContext } from 'formik'
import { LoginFormValues } from 'pages/Login'

interface LoginTextFieldProps {
  id: string
  label: string
  type: string
}

const LoginTextField = ({ id, label, type }: LoginTextFieldProps) => {
  const context = useFormikContext<LoginFormValues>()

  return (
    <TextField
      required
      name={id}
      type={type}
      label={label}
      value={context.values[id]}
      onChange={context.handleChange}
      error={context.touched[id] && Boolean(context.errors[id])}
      helperText={context.touched[id] && context.errors[id]}
    />
  )
}

export { LoginTextField }
