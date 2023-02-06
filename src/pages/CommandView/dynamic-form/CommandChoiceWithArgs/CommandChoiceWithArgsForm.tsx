import { Box, Button, ButtonGroup } from '@mui/material'
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import useAxios from 'axios-hooks'
import { Snackbar } from 'components/Snackbar'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { CommandBasicSchema, getSchema, ParameterAsProperty } from 'formHelpers'
import { Form, Formik, FormikHelpers, FormikValues } from 'formik'
import { useMountedState } from 'hooks/useMountedState'
import { useMyAxios } from 'hooks/useMyAxios'
import {
  extractModel,
  getOnChangeFunctions,
  JobRequestFormModelPreview,
  OnChangeFunctionMap,
  SystemProperties,
  useChoicesState,
} from 'pages/CommandView/dynamic-form'
import { SubmitButton } from 'pages/CommandView/dynamic-form/CommandChoiceWithArgs'
import { getFormComponents } from 'pages/CommandView/dynamic-form/CommandChoiceWithArgs/form-components/getFormComponents'
import { createContext, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Request, RequestTemplate } from 'types/backend-types'
import {
  AugmentedCommand,
  SnackbarState,
  StrippedSystem,
} from 'types/custom-types'

type DynamicLoadingProviderContext = {
  loadingChoicesContext: { [name: string]: boolean }
  dynamicRequestErrors: { [name: string]: AxiosError | undefined }
  setLoadingChoicesContext: (name: string, isLoading: boolean) => void
  setDynamicRequestErrors: (name: string, error: AxiosError | undefined) => void
}

const DynamicLoadingContext = createContext<DynamicLoadingProviderContext>({
  loadingChoicesContext: {},
  dynamicRequestErrors: {},
  setLoadingChoicesContext: () => {
    return
  },
  setDynamicRequestErrors: () => {
    return
  },
})

const CommandChoiceWithArgsForm = (
  system: StrippedSystem,
  command: AugmentedCommand,
  isJob: boolean,
) => {
  const { axiosManualOptions } = useMyAxios()
  const { authEnabled } = ServerConfigContainer.useContainer()
  const [, execute] = useAxios({}, axiosManualOptions)
  const navigate = useNavigate()
  const [submitStatus, setSubmitStatus] = useMountedState<
      SnackbarState | undefined
      >()
  const [loadingChoicesContext, _setLoadingChoicesForNames] = useMountedState<{
    [name: string]: boolean
  }>({})
  const [dynamicRequestErrors, _setDynamicRequestErrors] = useMountedState<{
    [name: string]: AxiosError | undefined
  }>({})

  const setLoadingChoicesContext = (name: string, isLoading: boolean) => {
    loadingChoicesContext[name] = isLoading
    _setLoadingChoicesForNames(loadingChoicesContext)
  }

  const setDynamicRequestErrors = (
    name: string,
    error: AxiosError | undefined,
  ) => {
    dynamicRequestErrors[name] = error
    _setDynamicRequestErrors(dynamicRequestErrors)
  }

  const instances = system.instances
  const parameters = command.parameters

  const schema: CommandBasicSchema = getSchema(instances, parameters)
  const parametersSchema = schema.properties.parameters
    .properties as ParameterAsProperty
  const instancesSchema =
    schema.properties.instance_names.properties.instance_name
  const systemProperties = {
    system: system.name,
    version: system.version,
    namespace: system.namespace,
  } as SystemProperties

  const model = extractModel(parametersSchema, instancesSchema)
  const [stateManager, resetAll] = useChoicesState(system, command)
  const previewModel = useMemo(
    () => stateManager.model.get(),
    [stateManager.model],
  )

  const onChangeFunctions: OnChangeFunctionMap = getOnChangeFunctions(
    parameters,
    stateManager,
    systemProperties,
    setLoadingChoicesContext,
    setDynamicRequestErrors,
  )

  const onSubmit = <T extends FormikValues>(
    formFields: T,
    formikActions: FormikHelpers<T>,
  ) => {
    const payload: RequestTemplate = {
      system: command.systemName,
      system_version: command.systemVersion,
      namespace: command.namespace,
      command: command.name,
      command_type: command.command_type,
      output_type: command.output_type,
      ...stateManager.model.get(),
    }

    const config: AxiosRequestConfig<RequestTemplate> = {
      url: '/api/v1/requests',
      method: 'post',
      data: payload,
      withCredentials: authEnabled,
    }

    execute(config)
      .then((response: AxiosResponse<Request>) => {
        navigate('/requests/' + response.data.id)
      })
      .catch((error: AxiosError) => {
        console.error(error)
        setSubmitStatus({
          severity: 'error',
          message: JSON.stringify(error.toJSON()),
          showSeverity: true,
          doNotAutoDismiss: true,
        })
      })

    formikActions.setSubmitting(false)
  }

  return (
    <Box p={2} display="flex" alignItems="flex-start">
      <Formik onSubmit={onSubmit} initialValues={model}>
        <>
          <Box width={3 / 5}>
            <DynamicLoadingContext.Provider
              value={{
                loadingChoicesContext: loadingChoicesContext,
                dynamicRequestErrors: dynamicRequestErrors,
                setLoadingChoicesContext: setLoadingChoicesContext,
                setDynamicRequestErrors: setDynamicRequestErrors,
              }}
            >
              <Form>
                {getFormComponents(
                  parametersSchema,
                  instancesSchema,
                  onChangeFunctions,
                  execute,
                  stateManager,
                )}
                <ButtonGroup variant="contained" size="large">
                  <Button onClick={resetAll}>Reset</Button>
                  <SubmitButton
                    schemaProperties={schema.properties}
                    stateManager={stateManager}
                  />
                </ButtonGroup>
              </Form>
            </DynamicLoadingContext.Provider>
          </Box>
          <JobRequestFormModelPreview data={previewModel} />
        </>
      </Formik>
      {submitStatus ? <Snackbar status={submitStatus} /> : null}
    </Box>
  )
}

export { CommandChoiceWithArgsForm, DynamicLoadingContext }
