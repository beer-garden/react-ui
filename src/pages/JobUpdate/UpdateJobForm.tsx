import { Box, Button, ButtonGroup } from '@mui/material'
import { ErrorSchema, FormValidation, IChangeEvent } from '@rjsf/core'
import { MuiForm5 as Form } from '@rjsf/material-ui'
import { JsonCard } from 'components/JsonCard'
import { Snackbar } from 'components/Snackbar'
import { CustomFileWidget } from 'pages/CommandView'
import { useState } from 'react'
import { Job } from 'types/backend-types'
import { ObjectWithStringKeys, SnackbarState } from 'types/custom-types'

interface JobFormProps {
  schema: ObjectWithStringKeys
  uiSchema: Record<string, unknown>
  initialModel: ObjectWithStringKeys
  job: Job
  isJob: boolean
  validator?: <T extends Record<string, unknown>>(
    formData: T,
    errors: FormValidation,
  ) => FormValidation
}

const UpdateJobForm = ({
  schema,
  uiSchema,
  initialModel,
  job,
  isJob,
  validator,
}: JobFormProps) => {
  const [submitStatus, setSubmitStatus] = useState<SnackbarState | undefined>(
    undefined,
  )
  const [model, setModel] = useState(initialModel)
  const [displayModel] = useState(model)
  // const navigate = useNavigate()
  // const { authEnabled } = ServerConfigContainer.useContainer()
  // const { axiosManualOptions } = useMyAxios()
  // const [, execute] = useAxios({}, axiosManualOptions)

  // TODO: make these work
  const onResetForm = () => {
    //
  }

  const onFormUpdated = (
    changeEvent: IChangeEvent,
    es: ErrorSchema | undefined,
  ) => {
    const formData = changeEvent.formData
    setModel(formData)

    // const cleanedModel = cleanModelForDisplay(formData, command.parameters)
    // setDisplayModel(cleanedModel)
  }

  const raiseError = (message: string) => {
    console.error(message)

    setSubmitStatus({
      severity: 'error',
      message: message,
      showSeverity: false,
      doNotAutoDismiss: true,
    })
  }

  const handleError = (message: string) => {
    // this is meant to do nothing but swallow the error message;
    // the Form will automatically show validation messages in the UI and
    // having this *do nothing* function prevents those messages from also
    // being dumped to console.error
  }

  const onSubmit = () => {
    // let argumentToSubmit: Job | RequestTemplate
    // let payload: Job | RequestTemplate

    try {
      // argumentToSubmit = getSubmitArgument(model, job, isJob)
      // payload = prepareModelForSubmit(
      //   argumentToSubmit,
      //   job.request_template.parameters,
      //   isJob,
      // )
    } catch (error) {
      raiseError(String(error))

      return
    }

    // const forwardPath = isJob ? '/jobs/' : '/requests/'

    // const path = isJob ? '/api/v1/jobs' : '/api/v1/requests'

    // execute({
    //   url: path,
    //   method: 'post',
    //   data: payload,
    //   withCredentials: authEnabled,
    // })
    //   .then((response) => {
    //     navigate(forwardPath + response.data.id)
    //   })
    //   .catch((error) => {
    //     raiseError(error.toJSON())
    //   })
  }

  const widgets = {
    FileWidget: CustomFileWidget,
  }

  return (
    <Box p={2} display="flex" alignItems="flex-start">
      <Box width={3 / 5}>
        <Form
          schema={schema}
          uiSchema={uiSchema}
          formData={model}
          onChange={onFormUpdated}
          onSubmit={onSubmit}
          onError={handleError}
          validate={validator}
          widgets={widgets}
        >
          <ButtonGroup variant="contained" size="large">
            <Button onClick={onResetForm}>Reset</Button>
            <Button type="submit">{isJob ? 'Schedule' : 'Execute'}</Button>
          </ButtonGroup>
        </Form>
      </Box>
      {submitStatus ? <Snackbar status={submitStatus} /> : null}
      <Box pl={1} width={2 / 5} style={{ verticalAlign: 'top' }}>
        <JsonCard title="Preview" data={displayModel} />
      </Box>
    </Box>
  )
}

export { UpdateJobForm }
