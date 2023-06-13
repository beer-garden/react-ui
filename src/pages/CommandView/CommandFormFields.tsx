import { TabContext, TabList } from '@mui/lab'
import { Alert, Box, Grid, MenuItem, Tab, TextField, TextFieldProps } from '@mui/material'
import { Divider } from 'components/Divider'
import { useMountedState } from 'hooks/useMountedState'
import { ParameterElement } from 'pages/CommandView'
import { useFormContext } from 'react-hook-form'
import { Instance, Parameter } from 'types/backend-types'


const CommandFormFields = ({ parameters, instances, parentKey }: { parameters: Parameter[], instances: Instance[], parentKey?: string}) => {
  const [tabValue, setTabValue] = useMountedState<'required' | 'optional'>('required')

  const textFieldProps: TextFieldProps = {
    size:'small',
    disabled: true,
    fullWidth: true,
  }
    
  const { register, formState: { errors } } = useFormContext()
  const getKey = (key: string) => (
    parentKey ? [parentKey, key].join('.') : key
  )
  

  const requiredParams = parameters.filter((param: Parameter) => (!param.optional)) || []
  const optionalParams = parameters.filter((param: Parameter) => (param.optional)) || []

  return (
    <>
      <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={(event: React.SyntheticEvent, newValue: 'required' | 'optional') => setTabValue(newValue)} >
            <Tab label="Required Fields" value="required" />
            {optionalParams.length > 0 && <Tab label="Optional Fields" value="optional" />}
          </TabList>
        </Box>
        <Box display={tabValue === 'required' ? '' : 'none'}>
            { requiredParams.length ? 
              <ParameterElement parameters={requiredParams} parentKey={getKey('parameters')} /> :
              <Alert severity="info">None</Alert>
            }
        </Box>
        <Box display={tabValue === 'optional' ? '' : 'none'}>
            <ParameterElement parameters={optionalParams} parentKey={getKey('parameters')} />
        </Box>
      </TabContext>
      <Divider />
      <Grid 
        container
        columns={4}
        columnSpacing={1}
        rowSpacing={2}
      >
        <Grid key="systemName" minWidth="150px" xs={1} item>
          <TextField label="System Name" {...textFieldProps} {...register(getKey('system'))} />
        </Grid>
        <Grid key="systemVersion" minWidth="150px" xs={1} item>
          <TextField label="System Version" {...textFieldProps} {...register(getKey('system_version'))} />
        </Grid>
        <Grid key="commandName" minWidth="150px" xs={1} item>
          <TextField label="Command Name" {...textFieldProps} {...register(getKey('command'))} />
        </Grid>
        <Grid key="instanceName" minWidth="150px" xs={1} item>
          {
            instances.length === 1 ?
            <TextField label="Instance Name" {...textFieldProps} {...register(getKey('instance_name'))} />
            :
            <TextField
              label="Instance Name"
              type="string"
              size="small"
              error={!!errors['instance_name']}
              helperText={errors['instance_name']?.message || ''}
              select
              defaultValue={''}
              fullWidth
              {...register(getKey('instance_name'), {required: 'Instance is required'})}
            >
              {(instances.sort((a, b) =>
                (a.name < b.name ? -1 : 1)
              ).map((instance, index) => (
                <MenuItem key={`${instance.name}MenuItem${index}`} value={instance.name} >
                  {instance.name}
                </MenuItem>)
              ))}
            </TextField>
          }
        </Grid>
      </Grid>
      <TextField
        {...textFieldProps}
        disabled={false}
        multiline
        label="Comment"
        error={!!errors['comment']}
        helperText={errors['comment']?.message || ''}
        maxRows={3}
        {...register(getKey('comment'), {
          maxLength: {value: 140, message: 'Maximum comment length is 140 characters'}
        })}
      />
    </>
  )
}

export { CommandFormFields }
