import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import { useFormikContext } from 'formik'
import { ConnectionFormFields } from './ConnectionFormFields'
import { FC } from 'react'

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
