import { Checkbox, FormControlLabel, FormGroup, Tooltip } from '@mui/material'
import { useFormikContext } from 'formik'
import { ConnectionFormFields } from 'pages/GardenAdminView'

interface ConnectionCheckboxGroupProps {
  id: string
  label: string
  tooltip?: string
}

const ConnectionCheckboxGroup = ({
  id,
  label,
  tooltip,
}: ConnectionCheckboxGroupProps) => {
  const context = useFormikContext<ConnectionFormFields>()

  return (
    <FormGroup sx={{ width: '27%' }}>
      {tooltip ? (
        <Tooltip title={tooltip}>
          <FormControlLabel
            control={
              <Checkbox
                name={id}
                checked={Boolean(context.values[id])}
                onChange={context.handleChange}
              />
            }
            label={label}
            sx={{ mt: 2, pr: 1 }}
          />
        </Tooltip>
      ) : (
        <FormControlLabel
          control={
            <Checkbox
              name={id}
              checked={Boolean(context.values[id])}
              onChange={context.handleChange}
            />
          }
          label={label}
          sx={{ mt: 2, pr: 1 }}
        />
      )}
    </FormGroup>
  )
}

export { ConnectionCheckboxGroup }
