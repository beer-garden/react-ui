import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import { useFormikContext } from 'formik'
import { FC } from 'react'
import { ConnectionFormFields } from './ConnectionFormFields'

interface ConnectionCheckboxGroupProps {
  id: string
  label: string
}

const ConnectionCheckboxGroup: FC<ConnectionCheckboxGroupProps> = ({
  id,
  label,
}) => {
  const context = useFormikContext<ConnectionFormFields>()

  return (
    <FormGroup sx={{ width: '27%' }}>
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
    </FormGroup>
  )
}

export default ConnectionCheckboxGroup
