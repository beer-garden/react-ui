import { Grid, GridProps, TextFieldProps } from '@mui/material'
import { FormTextField } from 'components/FormComponents'
import { DateTime } from 'luxon'
import { TriggerType } from 'types/backend-types'


const JobDateFields = ({ triggerType, textFieldProps, ...gridProps }: {triggerType: TriggerType, textFieldProps: TextFieldProps} & GridProps) => {
  const gridItemProps: GridProps = {
    item: true,
    minWidth: '280px',
    xs: 1
  }

  return (
    <Grid container columns={2} {...gridProps} >
      <Grid {...gridItemProps} >
        <FormTextField
          {...textFieldProps}
          registerKey="trigger.run_date"
          registerOptions={{
            setValueAs: value => {
              if(typeof value === 'number'){
                return value
              }
              const dateTime = DateTime.fromISO(value)
              return value === '' ? '' : new Date(dateTime.toHTTP()).getTime()
            },
            required: {
              value: triggerType === 'date',
              message: 'Run Date is required'
            },
          }}
          type="datetime-local"
          label="Run Date"
          helperText="Exact time to run this job"
        />
      </Grid>
      <Grid {...gridItemProps} >
        <FormTextField
          {...textFieldProps}
          registerKey="trigger.timezone"
          label="Time Zone"
          registerOptions={{
            validate: value => DateTime.local().setZone(value).isValid || 'Enter a valid time zone',
            required: {
              value: triggerType === 'date',
              message: 'Time zone is required'
            },
          }}
        />
      </Grid>
    </Grid>
  )
}

export { JobDateFields }
