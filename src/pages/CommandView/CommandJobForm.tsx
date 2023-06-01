import { Button, Grid, Stack } from '@mui/material'
import { AxiosError, AxiosRequestConfig, AxiosResponse, Method } from 'axios'
import useAxios from 'axios-hooks'
import { JobRequestCreationContext } from 'components/JobRequestCreation'
import { JobSettingFormFields } from 'components/JobSettingForm'
import { JsonCard } from 'components/JsonCard'
import { Snackbar } from 'components/Snackbar'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { useMountedState } from 'hooks/useMountedState'
import { useMyAxios } from 'hooks/useMyAxios'
import { CommandFormFields, PreviewCard } from 'pages/CommandView'
import { useContext } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Command, Job, Parameter, PatchOperation, Request, RequestTemplate } from 'types/backend-types'
import { SnackbarState, StrippedSystem } from 'types/custom-types'


const CommandJobForm = ({ system, command, isJob}: {system: StrippedSystem, command: Command, isJob?: boolean}) => {
  const { axiosManualOptions } = useMyAxios()
  const navigate = useNavigate()
  const { authEnabled, debugEnabled } = ServerConfigContainer.useContainer()
  const [, execute] = useAxios({}, axiosManualOptions)
  const [submitStatus, setSubmitStatus] = useMountedState<
    SnackbarState | undefined
  >()
  const { requestModel, job } = useContext(JobRequestCreationContext)
  const raiseError = (message: string) => {
    console.error(message)
    setSubmitStatus({
      severity: 'error',
      message: message,
      showSeverity: false,
      doNotAutoDismiss: true,
    })
  }
  const [showJobFields, setShowJobFields] = useMountedState(false)

  const getDefaultParamValues = (parameters: Parameter[]) => {
      const defaultParamValues: {[key: string]: unknown} = {}
      parameters.forEach((parameter: Parameter) => {
          if(parameter.parameters.length) {
            defaultParamValues[parameter.key] = parameter.multi ? 
            [getDefaultParamValues(parameter.parameters)] : getDefaultParamValues(parameter.parameters)
          }
          else {
            if(parameter.default || parameter.default === false) 
              defaultParamValues[parameter.key] = parameter.default
          }
      })
      return defaultParamValues
  }

  const getRequestTemplate = (): RequestTemplate => ({
    system: system.name,
    system_version: system.version,
    namespace: system.namespace,
    command: command.name,
    comment: '',
    output_type: command.output_type,
    instance_name: system.instances.length === 1 ? system.instances[0].name : '',
    parameters: getDefaultParamValues(command.parameters)
  })
  
  const defaultValues: FieldValues = isJob ?
    {
      trigger_type: '',
      trigger: {timezone: 'UTC'},
      misfire_grace_time: 5,
      coalesce: true,
      max_instances: 3,
      request_template: getRequestTemplate(),
    } : getRequestTemplate()
    
  const methods = useForm({defaultValues: (isJob ? job : requestModel) || defaultValues})
  const { handleSubmit, formState: { errors }, reset, resetField, trigger } = methods

  const switchCommandOrJob =async () => {
    if(showJobFields || await trigger('request_template')) setShowJobFields(!showJobFields)
  }

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
      let path = '/api/v1/requests'
      let method: Method = 'post'
      let operation: PatchOperation | undefined
      if(isJob) {
        if(job){
          method = 'patch'
          path = `/api/v1/jobs/${job.id}`
          operation = { operations: [
            {
              operation: 'update',
              path: '/job',
              value: data as unknown as Job
            }
          ]}
        } else {
          path = '/api/v1/jobs'
        }
      }
      const config: AxiosRequestConfig<FormData | PatchOperation | RequestTemplate> = {
        url: path,
        method: method,
        data: formData || operation || requestData,
        headers: headers,
        withCredentials: authEnabled,
      }

      execute(config)
        .then((response: AxiosResponse<Request | Job>) => {
          let path = '/requests/'
          if(isJob) path = '/jobs/'
          navigate(path + response.data.id)
        })
        .catch((error: AxiosError) => {
          raiseError(JSON.stringify(error.toJSON()))
        })
    }
  }

  const formReset = () => {
    if(isJob) {
      if(showJobFields){
        const tempDefaultValues = defaultValues
        delete tempDefaultValues['request_template']
        reset(formValues => ({
          ...formValues,
          ...tempDefaultValues,
        }))
      } else resetField('request_template', { defaultValue: defaultValues.request_template })

    } else (
      reset(defaultValues)
    )
  }

  return (
    <>
      <FormProvider {...methods} >
        <Grid columns={5} spacing={1} py={1} alignItems="start" justifyContent="space-between" container>
          <Grid minWidth="300px" xs={3} key="form" item>
            <form onSubmit={handleSubmit(onSubmit)} >
              <Stack rowGap={2} >
                {!showJobFields ?
                  <CommandFormFields parentKey={isJob ? 'request_template' : ''} parameters={command.parameters} instances={system.instances} />
                  :
                  <JobSettingFormFields />
                }
                <Stack direction="row" spacing={1} >
                  <Button sx={{width: '150px'}} type="button" onClick={() => formReset()} variant="contained" >Reset</Button>
                  {isJob && 
                    <Button sx={{width: '150px'}} type="button" onClick={() => switchCommandOrJob()} variant="contained" >{!showJobFields ? 'Next' : 'Back'}</Button>
                  }
                  { (!isJob || showJobFields) &&
                    <Button sx={{width: '150px'}} type="submit" variant="contained" >{!isJob ? 'Make Request' : 'Schedule' }</Button>
                  }
                </Stack>
              </Stack>
            </form>
            {debugEnabled && !showJobFields && (
              <Stack mt={5} direction={'row'} spacing={2}>
                <JsonCard title="Command" data={command} />
              </Stack>
            )}
          </Grid>
          <Grid minWidth="500px" xs={2} key="preview" item>
            <PreviewCard />
          </Grid>
        </Grid>
      </FormProvider>
      {submitStatus ? <Snackbar status={submitStatus} /> : null}
    </>
  )
}

export { CommandJobForm }
