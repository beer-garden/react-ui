import { Grid, GridProps, TextFieldProps } from '@mui/material'
import { FormTextField } from 'components/FormComponents'
import { DateTime } from 'luxon'
import { TriggerType } from 'types/backend-types'

const JobCronFields = ({ triggerType, textFieldProps, ...gridProps }: {triggerType: TriggerType, textFieldProps: TextFieldProps} & GridProps) => {
  const gridItemProps: GridProps = {
    item: true,
    minWidth: '250px',
    xs: 3
  }
  const fieldKeys = ['minute', 'hour', 'day', 'month', 'day_of_week', 'year', 'week', 'second']

  const validateUnit = (key: string, value: string, label: string) => {
    if(value === '*') {
      return true
    }
    try {
      const tempValue = JSON.parse(value)
      if( typeof tempValue === 'number' ) {
        return true
      } else throw new Error('value is not valid')
    } catch(e) {
      return `${label} must be character * or a number`
    }
  }

  const fieldKeyToLabel = (key: string) => ((key.charAt(0).toUpperCase() + key.slice(1)).replaceAll('_', ' '))

  return (
    <Grid container columns={10} {...gridProps} >
      {fieldKeys.map((key) => {
        return (
          <Grid key={key} item xs={2} minWidth="200px" >
            <FormTextField
              {...textFieldProps}
              registerKey={['trigger', key].join('.')}
              registerOptions = {
                {
                  required: {value: triggerType === 'cron', message: `${fieldKeyToLabel(key)} is required`},
                  validate: value => validateUnit(['trigger', key].join('.'), value, fieldKeyToLabel(key))
                }
              }
              label={fieldKeyToLabel(key)}
            />
          </Grid>
        )
      })}
      <Grid item xs={2} minWidth="200px" >
        <FormTextField
          {...textFieldProps}
          registerKey={['trigger', 'jitter'].join('.')}
          registerOptions={{
            valueAsNumber: true,
          }}
          type="number"
          label="Jitter (seconds)"
          helperText="Advance or delay job execution"
        />
      </Grid>
      <Grid {...gridItemProps} >
        <FormTextField
          {...textFieldProps}
          registerKey="trigger.start_date"
          registerOptions={{
            setValueAs: value => {
              const dateTime = DateTime.fromISO(value)
              return (value === '' || value === null) ? null : new Date(dateTime.toHTTP()).getTime()
            },
          }}
          type="datetime-local"
          label="Start Date"
        />
      </Grid>
      <Grid {...gridItemProps} >
        <FormTextField
          {...textFieldProps}
          registerKey="trigger.end_date"
          registerOptions={{
            setValueAs: value => {
              const dateTime = DateTime.fromISO(value)
              return (value === '' || value === null) ? null : new Date(dateTime.toHTTP()).getTime()
            },
          }}
          type="datetime-local"
          label="End Date"
        />
      </Grid>
      <Grid {...gridItemProps} >
        <FormTextField
          {...textFieldProps}
          registerKey="trigger.timezone"
          label="Time Zone"
          registerOptions={{
            validate: value => DateTime.local().setZone(value).isValid || 'Enter a valid time zone',
          }}
        />
      </Grid>
    </Grid>
  )
}

export { JobCronFields }
