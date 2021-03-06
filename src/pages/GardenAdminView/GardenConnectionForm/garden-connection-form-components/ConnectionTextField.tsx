import { TextField, Tooltip } from '@mui/material'
import { useFormikContext } from 'formik'
import { ConnectionFormFields } from 'pages/GardenAdminView'

export type ConnectionTextFieldPropsType = {
  id: string
  label: string
  sx?: object
  type?: string
  tooltip?: string
}

interface ConnectionTextFieldProps {
  props: ConnectionTextFieldPropsType
}

const ConnectionTextField = ({ props }: ConnectionTextFieldProps) => {
  const context = useFormikContext<ConnectionFormFields>()
  const { id, label, type, sx, tooltip } = props

  return tooltip ? (
    <Tooltip title={tooltip}>
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
    </Tooltip>
  ) : (
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

const getFieldValues = (
  id: string,
  label: string,
  sx: object = {},
  type = 'text',
) => {
  return {
    id: id,
    label: label,
    type: type,
    sx: {
      ...defaultSx,
      ...sx,
    },
  }
}

const defaultSx = {
  mb: 1,
  mt: 2,
  width: '25%',
}

export { ConnectionTextField, getFieldValues }
