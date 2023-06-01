import { TabContext, TabList } from '@mui/lab'
import { Alert, Box, Grid, GridProps, Tab, TextFieldProps } from '@mui/material'
import { FormTextField } from 'components/FormComponents'
import { JobCronFields, JobDateFields, JobIntervalFields, JobOptionaFields } from 'components/JobSettingForm'
import { useMountedState } from 'hooks/useMountedState'
import { useFormContext } from 'react-hook-form'


const JobSettingFormFields = () => {
  const [tabValue, setTabValue] = useMountedState<'required' | 'optional'>('required')
  const { watch, getValues, resetField } = useFormContext()
  const textFieldProps: TextFieldProps = {}

  const triggerType = watch('trigger_type')
  
  const triggerTypeChange = (value: string) => {
    if(value === 'date') {
      resetField('trigger', {
        defaultValue: {
          run_date: '',
          timezone: getValues('trigger.timezone') || 'UTC'
        }
      })
    } 
    if(value === 'cron'){
      resetField('trigger', {
        defaultValue: {
          minute: '0',
          hour: '0',
          day: '1',
          month: '1',
          day_of_week: '*',
          year: '*',
          week: '*',
          second: '0',
          jitter: null,
          start_date: '',
          end_date: '',
          timezone: getValues('trigger.timezone') || 'UTC',
        }
      })
    }
    if(value === 'interval'){
      resetField('trigger', {
        defaultValue: {
          hours: 1,
          jitter: null,
          reschedule_on_finish: false,
          start_date: '',
          end_date: '',
          timezone: getValues('trigger.timezone') || 'UTC',
        }
      })
    }
    return value
  }

  const gridProps: GridProps = {columnSpacing: 1, rowSpacing: 2, py: 1}

  return (
    <>
      <Grid container key="JobDateInfo" columns={1} {...gridProps} >
        <Grid item xs={1} >
          <FormTextField
            {...textFieldProps}
            registerKey="name"
            registerOptions={{
              required: {
                value: true,
                message: 'Job name is required'
              }
            }}
            label="Job Name"
            fullWidth={false}
            sx={{mt: 2, minWidth: '150px'}}
          />
        </Grid>
        <Grid item xs={1} >
          <FormTextField
            registerKey="trigger_type"
            registerOptions={{
              required: {
                value: true,
                message: 'Trigger type is required'
              },
              onChange: (e) => triggerTypeChange(e.target.value)
              // setValueAs: value => triggerTypeChange(value)
            }}
            menuOptions={['cron', 'date', 'interval']}
            label="Trigger type"
            fullWidth={false}
            sx={{minWidth: '150px'}}
          />
        </Grid>
      </Grid>
      <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={(event: React.SyntheticEvent, newValue: 'required' | 'optional') => setTabValue(newValue)} >
            <Tab label="Trigger Fields" value="required" />
            <Tab label="Optional Job Fields" value="optional" />
          </TabList>
        </Box>
        { tabValue === 'required' &&
          ((triggerType === 'date' && <JobDateFields triggerType={triggerType} textFieldProps={textFieldProps} {...gridProps} />)
          || (triggerType === 'interval' && <JobIntervalFields triggerType={triggerType} textFieldProps={textFieldProps} {...gridProps} />)
          || (triggerType === 'cron' && <JobCronFields triggerType={triggerType} textFieldProps={textFieldProps} {...gridProps} />))
        }
        <JobOptionaFields textFieldProps={textFieldProps} {...gridProps} display={tabValue === 'optional' ? '' : 'none'} />
        {tabValue !== 'optional' && !triggerType &&
          <Alert severity="warning" >Select trigger type to set trigger fields</Alert>
        }
        <Box display={tabValue === 'optional' ? '' : 'none'} />
      </TabContext>
    </>
      
  )
}

export { JobSettingFormFields }
