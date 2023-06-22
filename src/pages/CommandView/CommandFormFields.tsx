import { TabContext, TabList } from '@mui/lab'
import { Alert, Box, Grid, Tab, TextFieldProps } from '@mui/material'
import { Divider } from 'components/Divider'
import { FormTextField } from 'components/FormComponents'
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
    
  const { formState: { errors } } = useFormContext()
  const getKey = (key: string) => (
    parentKey ? [parentKey, key].join('.') : key
  )

  const instancesNames: (string | number)[] | undefined = instances.length === 1 ? undefined : []
  if(instancesNames) instances.sort((a, b) =>
    (a.name < b.name ? -1 : 1)
  ).forEach(instance => instancesNames.push(instance.name))

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
          <FormTextField label="System Name" {...textFieldProps} registerKey={getKey('system')} />
        </Grid>
        <Grid key="systemVersion" minWidth="150px" xs={1} item>
          <FormTextField label="System Version" {...textFieldProps} registerKey={getKey('system_version')} />
        </Grid>
        <Grid key="commandName" minWidth="150px" xs={1} item>
          <FormTextField label="Command Name" {...textFieldProps} registerKey={getKey('command')} />
        </Grid>
        <Grid key="instanceName" minWidth="150px" xs={1} item>
          <FormTextField
            label="Instance Name"
            {...textFieldProps}
            disabled={instances.length <= 1}
            registerKey={getKey('instance_name')}
            registerOptions={{required: {value: true, message: 'Instance Name is required'}}}
            menuOptions={instancesNames}
          />
        </Grid>
      </Grid>
      <FormTextField
        {...textFieldProps}
        disabled={false}
        multiline
        label="Comment"
        error={!!errors['comment']}
        helperText={errors['comment']?.message || ''}
        maxRows={3}
        registerKey={getKey('comment')}
        registerOptions={
          {
            maxLength: {value: 140, message: 'Maximum comment length is 140 characters'}
          }
        }
      />
    </>
  )
}

export { CommandFormFields }
