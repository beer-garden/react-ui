<<<<<<< HEAD
import { Box, Button, ButtonGroup } from '@mui/material'
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
=======
import { Box, Button } from '@mui/material'
import { AxiosError, AxiosRequestConfig } from 'axios'
>>>>>>> 7cca223 (#138 - Dynamic choices cmd with args)
import useAxios from 'axios-hooks'
import { Snackbar } from 'components/Snackbar'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { CommandBasicSchema, getSchema, ParameterAsProperty } from 'formHelpers'
import { Form, Formik, FormikHelpers, FormikValues } from 'formik'
import { useMyAxios } from 'hooks/useMyAxios'
import {
  extractModel,
  getOnChangeFunctions,
<<<<<<< HEAD
  JobRequestFormModelPreview,
=======
  ModelPreview,
>>>>>>> 7cca223 (#138 - Dynamic choices cmd with args)
  OnChangeFunctionMap,
  SystemProperties,
  useChoicesState,
} from 'pages/CommandView/dynamic-form'
import { SubmitButton } from 'pages/CommandView/dynamic-form/CommandChoiceWithArgs'
import { getFormComponents } from 'pages/CommandView/dynamic-form/CommandChoiceWithArgs/form-components/getFormComponents'
<<<<<<< HEAD
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Request, RequestTemplate } from 'types/backend-types'
=======
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RequestTemplate } from 'types/backend-types'
>>>>>>> 7cca223 (#138 - Dynamic choices cmd with args)
import {
  AugmentedCommand,
  SnackbarState,
  StrippedSystem,
} from 'types/custom-types'

const CommandChoiceWithArgsForm = (
  system: StrippedSystem,
  command: AugmentedCommand,
  isJob: boolean,
) => {
  const { axiosManualOptions } = useMyAxios()
  const { authEnabled } = ServerConfigContainer.useContainer()
  const [, execute] = useAxios({}, axiosManualOptions)
  const navigate = useNavigate()
  const [submitStatus, setSubmitStatus] = useState<SnackbarState | undefined>(
    undefined,
  )

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
<<<<<<< HEAD
  const previewModel = useMemo(
    () => stateManager.model.get(),
    [stateManager.model],
  )
=======
>>>>>>> 7cca223 (#138 - Dynamic choices cmd with args)

  const onChangeFunctions: OnChangeFunctionMap = getOnChangeFunctions(
    parameters,
    stateManager,
    systemProperties,
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
<<<<<<< HEAD
      .then((response: AxiosResponse<Request>) => {
=======
      .then((response) => {
>>>>>>> 7cca223 (#138 - Dynamic choices cmd with args)
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
<<<<<<< HEAD
    <Box p={2} display="flex" alignItems="flex-start">
      <Formik onSubmit={onSubmit} initialValues={model}>
        <>
          <Box width={3 / 5}>
=======
    <>
      <Formik onSubmit={onSubmit} initialValues={model}>
        <Box pt={2} display="flex" alignItems="flex-start">
          <Box pr={2} width={1 / 2}>
>>>>>>> 7cca223 (#138 - Dynamic choices cmd with args)
            <Form>
              {getFormComponents(
                parametersSchema,
                instancesSchema,
                onChangeFunctions,
                execute,
                stateManager,
              )}
<<<<<<< HEAD
              <ButtonGroup variant="contained" size="large">
                <Button onClick={resetAll}>Reset</Button>
                <SubmitButton
                  schemaProperties={schema.properties}
                  stateManager={stateManager}
                />
              </ButtonGroup>
            </Form>
          </Box>
          <JobRequestFormModelPreview data={previewModel} />
        </>
      </Formik>
      {submitStatus ? <Snackbar status={submitStatus} /> : null}
    </Box>
=======
              <Button color="secondary" variant="contained" onClick={resetAll}>
                Reset
              </Button>
              <SubmitButton
                schemaProperties={schema.properties}
                stateManager={stateManager}
              />
            </Form>
          </Box>
          <Box width={1 / 2}>
            <ModelPreview getData={stateManager.model.get} />
          </Box>
        </Box>
      </Formik>
      {submitStatus ? <Snackbar status={submitStatus} /> : null}
    </>
>>>>>>> 7cca223 (#138 - Dynamic choices cmd with args)
  )
}

export { CommandChoiceWithArgsForm }
