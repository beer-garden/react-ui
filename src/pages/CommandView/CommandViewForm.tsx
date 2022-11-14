import { Box, Button, ButtonGroup } from '@mui/material'
import { ErrorSchema, FormValidation, IChangeEvent } from '@rjsf/core'
import { MuiForm5 as Form } from '@rjsf/material-ui'
import { AxiosRequestConfig } from 'axios'
import useAxios from 'axios-hooks'
import { Snackbar } from 'components/Snackbar'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import {
  getSubmitArgument,
  prepareModelForSubmit,
} from 'formHelpers/get-submit-argument'
import { useMyAxios } from 'hooks/useMyAxios'
import {
  cleanModelForDisplay,
  CustomFileWidget,
  dataUrlToFile,
  FileMetaData,
  handleByteParametersReset,
  isByteCommand,
} from 'pages/CommandView'
import {
  createContext,
  createRef,
  Dispatch,
  SetStateAction,
  useState,
} from 'react'
import ReactJson from 'react-json-view'
import { useNavigate } from 'react-router-dom'
import { Job, RequestTemplate } from 'types/backend-types'
import {
  AugmentedCommand,
  ObjectWithStringKeys,
  SnackbarState,
} from 'types/custom-types'
import {
  CommandViewModel,
  CommandViewRequestModel,
} from 'types/form-model-types'

interface CommandViewFormProps {
  schema: ObjectWithStringKeys
  uiSchema: Record<string, unknown>
  initialModel: CommandViewModel
  command: AugmentedCommand
  isJob: boolean
  validator: <T extends Record<string, unknown>>(
    formData: T,
    errors: FormValidation,
  ) => FormValidation
}

type BytesParametersContextType = {
  fileMetaData: FileMetaData[]
  setFileMetaData: Dispatch<SetStateAction<FileMetaData[]>>
}

const BytesParameterContext = createContext<BytesParametersContextType>({
  fileMetaData: [] as FileMetaData[],
  setFileMetaData: () => {
    return
  },
})

const CommandViewForm = ({
  schema,
  uiSchema,
  initialModel,
  command,
  isJob,
  validator,
}: CommandViewFormProps) => {
  const [submitStatus, setSubmitStatus] = useState<SnackbarState | undefined>(
    undefined,
  )
  const [model, setModel] = useState<CommandViewModel>(initialModel)
  const [displayModel, setDisplayModel] = useState<CommandViewModel>(model)
  const [fileMetaData, setFileMetaData] = useState<FileMetaData[]>([])
  const navigate = useNavigate()
  const hasByteParameters = isByteCommand(command.parameters)
  const { authEnabled } = ServerConfigContainer.useContainer()
  const { axiosManualOptions } = useMyAxios()
  const [, execute] = useAxios({}, axiosManualOptions)

  const onResetForm = () => {
    setModel(
      handleByteParametersReset(
        initialModel as CommandViewRequestModel,
        model as CommandViewRequestModel,
        command.parameters,
      ),
    )
  }

  const onFormUpdated = (
    changeEvent: IChangeEvent,
    es: ErrorSchema | undefined,
  ) => {
    const formData = changeEvent.formData as CommandViewModel
    setModel(formData)

    const cleanedModel = cleanModelForDisplay(
      formData,
      command.parameters,
      isJob,
    )
    setDisplayModel(cleanedModel)
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
    if (hasByteParameters && isJob) {
      raiseError('Bytes parameters are not supported for scheduled jobs')
      return
    }

    let argumentToSubmit: Job | RequestTemplate
    let payload: Job | RequestTemplate

    try {
      argumentToSubmit = getSubmitArgument(
        model,
        command,
        isJob,
        hasByteParameters,
      )

      payload = prepareModelForSubmit(
        argumentToSubmit,
        command.parameters,
        isJob,
      )
    } catch (error) {
      raiseError(String(error))

      return
    }

    const forwardPath = isJob ? '/jobs/' : '/requests/'

    if (hasByteParameters) {
      const data = new FormData()

      data.append('request', JSON.stringify(payload))

      for (const fileData of fileMetaData) {
        const file = dataUrlToFile(fileData.dataUrl)
        data.append(fileData.parameterName as string, file, file.name)
      }

      const config = {
        url: '/api/v1/requests',
        method: 'post',
        data: data,
        headers: { 'Content-type': 'multipart/form-data' },
        withCredentials: authEnabled,
      } as AxiosRequestConfig<FormData>

      execute(config)
        .then((response) => {
          navigate(forwardPath + response.data.id)
        })
        .catch((error) => {
          raiseError(error.toJSON())
        })
    } else {
      const path = isJob ? '/api/v1/jobs' : '/api/v1/requests'

      execute({
        url: path,
        method: 'post',
        data: payload,
        withCredentials: authEnabled,
      })
        .then((response) => {
          navigate(forwardPath + response.data.id)
        })
        .catch((error) => {
          raiseError(error.toJSON())
        })
    }
  }

  const widgets = {
    FileWidget: CustomFileWidget,
  }

  const submitFormRef = createRef<HTMLButtonElement>()

  return (
    <Box pt={2} display="flex" alignItems="flex-start">
      <Box width={3 / 5}>
        <BytesParameterContext.Provider
          value={{ fileMetaData, setFileMetaData }}
        >
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
            <Button
              ref={submitFormRef}
              type="submit"
              sx={{ display: 'none' }}
            />
          </Form>
          <ButtonGroup variant="contained" size="large">
            <Button onClick={onResetForm}>Reset</Button>
            <Button
              type="submit"
              onClick={() => submitFormRef.current?.click()}
            >
              {isJob ? 'Schedule' : 'Execute'}
            </Button>
          </ButtonGroup>
        </BytesParameterContext.Provider>
      </Box>
      {submitStatus ? <Snackbar status={submitStatus} /> : null}
      <Box pl={1} width={2 / 5} style={{ verticalAlign: 'top' }}>
        <h3>Preview</h3>
        <ReactJson src={displayModel} />
      </Box>
    </Box>
  )
}

export { BytesParameterContext, CommandViewForm }
