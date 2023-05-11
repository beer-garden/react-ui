import { TabContext, TabList } from '@mui/lab'
import { Alert, Box, Button, Grid, MenuItem, Stack, Tab, TextField, TextFieldProps } from '@mui/material'
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import useAxios from 'axios-hooks'
import { JobRequestCreationContext } from 'components/JobRequestCreation'
import { Snackbar } from 'components/Snackbar'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { useMountedState } from 'hooks/useMountedState'
import { useMyAxios } from 'hooks/useMyAxios'
import { ParameterElement, PreviewCard } from 'pages/CommandView'
import { useContext } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'
import { Command, Parameter, Request, RequestTemplate } from 'types/backend-types'
import { SnackbarState, StrippedSystem } from 'types/custom-types'


const CommandForm = ({ system, command}: {system: StrippedSystem, command: Command}) => {
  const [tabValue, setTabValue] = useMountedState<'required' | 'optional'>('required')
  const { axiosManualOptions } = useMyAxios()
  const navigate = useNavigate()
  const { authEnabled } = ServerConfigContainer.useContainer()
  const [, execute] = useAxios({}, axiosManualOptions)
  const [submitStatus, setSubmitStatus] = useMountedState<
    SnackbarState | undefined
  >()
  const { requestModel } = useContext(JobRequestCreationContext)
  const raiseError = (message: string) => {
    console.error(message)

    setSubmitStatus({
      severity: 'error',
      message: message,
      showSeverity: false,
      doNotAutoDismiss: true,
    })
  }

  const textFieldProps: TextFieldProps = {
    size:'small',
    disabled: true,
    fullWidth: true
  }

  const getDefaultParamValues = (parameters: Parameter[]) => {
      const defaultParamValues: {[key: string]: unknown} = {}
      parameters.forEach((parameter: Parameter) => {
          if(parameter.parameters.length) {
            if(parameter.multi) defaultParamValues[parameter.key] = parameter.multi? 
            [getDefaultParamValues(parameter.parameters)] : getDefaultParamValues(parameter.parameters)
          }
          else {
            if(parameter.default || parameter.default === false) 
              defaultParamValues[parameter.key] = parameter.default
          }
      })
      return defaultParamValues
  }
  
  const defaultValues: FieldValues = {
      system: system.name,
      system_version: system.version,
      namespace: system.namespace,
      command: command.name,
      comment: '',
      output_type: command.output_type,
      instance_name: '',
      parameters: getDefaultParamValues(command.parameters)
  }
  if (system.instances.length === 1) defaultValues['instance_name'] = system.instances[0].name
    
  const methods = useForm({defaultValues: requestModel || defaultValues})
  const { register, handleSubmit, formState: { errors }, reset } = methods

  const onSubmit = (data: {[key: string]: unknown}) => {
    if(!Object.keys(errors).length) {
      let formData: FormData | undefined
      let headers = {}
      if(Object.hasOwn(data, 'multipart') && data['multipart']) {
        const multipartData = data['multipart'] as {[key: string]: File}
        delete data['multipart']
        formData = new FormData()
        formData.append('request', JSON.stringify(data))
        Object.keys(multipartData).forEach((key) => {
          if(formData) formData.append(key, multipartData[key] as File)
        })
        headers = { 'Content-type': 'multipart/form-data' }
      }
      const requestData: RequestTemplate = data as unknown as RequestTemplate
      const config: AxiosRequestConfig<FormData | RequestTemplate> = {
        url: '/api/v1/requests',
        method: 'post',
        data: formData || requestData,
        headers: headers,
        withCredentials: authEnabled,
      }

      execute(config)
        .then((response: AxiosResponse<Request>) => {
          navigate('/requests/' + response.data.id)
        })
        .catch((error: AxiosError) => {
          raiseError(JSON.stringify(error.toJSON()))
        })
    }
  }

  const areRequiredParams = command.parameters.find((param: Parameter) => (!param.optional))
  const areOptionalParams = command.parameters.find((param: Parameter) => (param.optional))

  return (
    <>
      <FormProvider {...methods} >
        <Grid columns={5} spacing={1} pt={1} alignItems="start" justifyContent="space-between" container>
          <Grid minWidth="300px" xs={3} key="form" item>
            <form onSubmit={handleSubmit(onSubmit)} >
              <Stack rowGap={1} >
                <TabContext value={tabValue}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={(event: React.SyntheticEvent, newValue: 'required' | 'optional') => setTabValue(newValue)} >
                      <Tab label="Required Fields" value="required" />
                      {areOptionalParams && <Tab label="Optional Fields" value="optional" />}
                    </TabList>
                  </Box>
                    <Box display={tabValue === 'required' ? '' : 'none'}>
                        { areRequiredParams ? 
                          <ParameterElement parameters={command.parameters.filter((param: Parameter) => (!param.optional))} parentKey="parameters" /> :
                          <Alert severity="info">None</Alert>
                        }
                    </Box>
                    <Box display={tabValue === 'optional' ? '' : 'none'}>
                        <ParameterElement parameters={command.parameters.filter((param: Parameter) => (param.optional))} parentKey="parameters" />
                    </Box>
                </TabContext>
                <Grid 
                  container
                  columns={4}
                  columnSpacing={1}
                  rowSpacing={2}
                  pt={1}
                >
                  <Grid key="systemName" minWidth="150px" xs={1} item>
                    <TextField label="System Name" {...textFieldProps} {...register('system')} />
                  </Grid>
                  <Grid key="systemVersion" minWidth="150px" xs={1} item>
                    <TextField label="System Version" {...textFieldProps} {...register('system_version')} />
                  </Grid>
                  <Grid key="commandName" minWidth="150px" xs={1} item>
                    <TextField label="Command Name" {...textFieldProps} {...register('command')} />
                  </Grid>
                  <Grid key="instanceName" minWidth="150px" xs={1} item>
                    {
                      system.instances.length === 1 ?
                      <TextField label="Instance Name" {...textFieldProps} {...register('instance_name')} />
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
                        {...register('instance_name', {required: 'Instance is required'})}
                      >{(system.instances.sort((a, b) =>
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
                  multiline
                  label="Comment"
                  size="small"
                  fullWidth
                  error={!!errors['comment']}
                  helperText={errors['comment']?.message || ''}
                  maxRows={3}
                  {...register('comment', {
                    maxLength: {value: 140, message: 'Maximum comment length is 140 characters'}
                  })}
                />
                <Stack direction="row" spacing={1} >
                  <Button sx={{width: '150px'}} type="button" onClick={() => reset(defaultValues)} variant="contained" >Reset</Button>
                  <Button sx={{width: '150px'}} type="submit" variant="contained" >Make Request</Button>
                </Stack>
              </Stack>
            </form>
          </Grid>
          <Grid minWidth="500px" xs={2} key="actions" item>
            <PreviewCard />
          </Grid>
        </Grid>
      </FormProvider>
      {submitStatus ? <Snackbar status={submitStatus} /> : null}
    </>
  )
}

export { CommandForm }
