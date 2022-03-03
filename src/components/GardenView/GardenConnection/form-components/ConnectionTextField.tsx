import { FC } from 'react'
import { useFormikContext } from 'formik'
import TextField from '@mui/material/TextField'
import { ConnectionFormFields } from './ConnectionFormFields'

export type ConnectionTextFieldPropsType = {
  id: string
  label: string
  sx?: object
  type?: string
}

interface ConnectionTextFieldProps {
  props: ConnectionTextFieldPropsType
}

export const ConnectionTextField: FC<ConnectionTextFieldProps> = ({
  props,
}) => {
  const context = useFormikContext<ConnectionFormFields>()
  const { id, label, type, sx } = props

  return (
    <TextField
      variant="standard"
      name={id}
      type={type}
      label={label}
      value={context.values[id]}
      onChange={context.handleChange}
      error={context.touched[id] && Boolean(context.errors[id])}
      helperText={context.touched[id] && context.errors[id]}
      sx={{ ...sx }}
    />
  )
}

export const getFieldValues = (
  id: string,
  label: string,
  sx: object = {},
  type = 'text'
) => {
  const value = {
    id: id,
    label: label,
    type: type,
    sx: {
      ...defaultSx,
      ...sx,
    },
  }
  return value
}

const defaultSx = {
  mb: 1,
  mt: 2,
  width: '25%',
}
