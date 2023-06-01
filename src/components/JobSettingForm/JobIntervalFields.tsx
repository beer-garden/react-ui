import { Grid, GridProps, MenuItem, TextField, TextFieldProps } from '@mui/material'
import { FormCheckbox, FormTextField } from 'components/FormComponents'
import { useMountedState } from 'hooks/useMountedState'
import { DateTime } from 'luxon'
import { useFormContext } from 'react-hook-form'
import { TriggerType } from 'types/backend-types'

type IntervalType = 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks'

const JobIntervalFields = ({ triggerType, textFieldProps, ...gridProps }: {triggerType: TriggerType, textFieldProps: TextFieldProps} & GridProps) => {
  const gridItemProps: GridProps = {
    item: true,
    minWidth: '250px',
    xs: 3
  }
  const [interval, setInterval] = useMountedState<IntervalType>('hours')

  const { getValues, setValue, unregister } = useFormContext()

  const onIntervalChange = (value: IntervalType) => {
    const oldValueKey = ['trigger', interval].join('.')
    setValue(['trigger', value].join('.'), getValues(oldValueKey))
    unregister(oldValueKey)
    setInterval(value)
  }

  return (
    <Grid container columns={12} {...gridProps} >
      <Grid {...gridItemProps} xs={2} minWidth="200px" >
        <FormTextField
          {...textFieldProps}
          registerKey={['trigger', interval].join('.')}
          registerOptions={{
            valueAsNumber: true,
            required: {
              value: triggerType === 'interval',
              message: 'Interval is required'
            },
          }}
          type="number"
          label="Interval"
          helperText="Repeat this job every X units"
        />
      </Grid>
      <Grid {...gridItemProps} xs={1} minWidth="125px" >
        <TextField
          select
          label="Units"
          value={interval}
          size="small"
          fullWidth
          onChange={(event) => onIntervalChange(event.target.value as IntervalType)}
          {...textFieldProps}
        >
          {['seconds', 'minutes', 'hours', 'days', 'weeks'].map((value) => <MenuItem key={value} value={value}>{value}</MenuItem>)}
        </TextField>
      </Grid>
      <Grid {...gridItemProps} xs={3} minWidth="250px" >
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
        <FormCheckbox registerKey="trigger.reschedule_on_finish" label="Reschedule on Finish" />
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

export { JobIntervalFields }
