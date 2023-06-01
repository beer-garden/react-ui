import { Grid, GridProps, TextFieldProps } from '@mui/material'
import { FormTextField } from 'components/FormComponents'

const JobOptionaFields = ({ textFieldProps, ...gridProps }: {textFieldProps: TextFieldProps} & GridProps) => {
  const gridItemProps: GridProps = {
    item: true,
    minWidth: '200px',
    xs: 1
  }

  return (
    <Grid container key="JobDateInfo" columns={3} {...gridProps} >
      <Grid {...gridItemProps} >
        <FormTextField
          {...textFieldProps}
          registerKey="misfire_grace_time"
          registerOptions={{
            valueAsNumber: true,
            min: {value: 0, message: 'Misfire Grace Time must be 0 or greater'},
          }}
          type="number"
          label="Misfire Grace Time"
          helperText="Grace time for missed jobs"
        />
      </Grid>
      <Grid {...gridItemProps} >
        <FormTextField
          {...textFieldProps}
          registerKey="max_instances"
          registerOptions={{
            valueAsNumber: true,
            min: {value: 0, message: 'Max Instances must be 0 or greater'},
          }}
          helperText="Maximum number of concurrent job executions"
          label="Max Instances"
        />
      </Grid>
      <Grid {...gridItemProps} >
        <FormTextField
          {...textFieldProps}
          registerKey="timeout"
          registerOptions={{
            valueAsNumber: true,
            min: {value: 0, message: 'Timeout must be 0 or greater'},
          }}
          helperText="Job timeout (in seconds)"
          label="Timeout"
        />
      </Grid>
    </Grid>
  )
}

export { JobOptionaFields }
