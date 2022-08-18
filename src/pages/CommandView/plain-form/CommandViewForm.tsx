import { Box, Button, ButtonGroup } from '@mui/material'
import { ErrorSchema, FormValidation, IChangeEvent } from '@rjsf/core'
import { MuiForm5 as Form } from '@rjsf/material-ui'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import useAxios from 'axios-hooks'
import { JsonCard } from 'components/JsonCard'
import { Snackbar } from 'components/Snackbar'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { CommandBasicSchema, JobPropertiesSchema } from 'formHelpers'
import {
  getSubmitArgument,
  prepareModelForSubmit,
} from 'formHelpers/get-submit-argument'
import { useMyAxios } from 'hooks/useMyAxios'
import { JSONSchema7 } from 'json-schema'
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
import { useNavigate } from 'react-router-dom'
import { Job, RequestTemplate } from 'types/backend-types'
import { AugmentedCommand, SnackbarState } from 'types/custom-types'
import {
  CommandViewModel,
  CommandViewRequestModel,
} from 'types/form-model-types'

interface CommandViewFormProps {
  schema: CommandBasicSchema | JobPropertiesSchema
  uiSchema: Record<string, unknown>
  initialModel: CommandViewModel
  command: AugmentedCommand
  isJob: boolean
  isReplay: boolean
  jobId?: string
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
  isReplay,
  jobId,
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
        isReplay,
        jobId,
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

      const config: AxiosRequestConfig<FormData> = {
        url: '/api/v1/requests',
        method: 'post',
        data: data,
        headers: { 'Content-type': 'multipart/form-data' },
        withCredentials: authEnabled,
      }

      execute(config)
        .then((response) => {
          navigate(forwardPath + response.data.id)
        })
        .catch((error) => {
          raiseError(error.toJSON())
        })
    } else {
      if (isJob) {
        const path = '/api/v1/jobs'
        if (isReplay) {
          // updating a Job is a 'patch'
          execute({
            url: path + '/' + jobId,
            method: 'patch',
            data: {
              operations: [
                {
                  operation: 'update',
                  path: '/job',
                  value: payload,
                },
              ],
            },
          })
            .then(() => {
              navigate(forwardPath + jobId)
            })
            .catch((error) => {
              raiseError(error.toJSON())
            })
        } else {
          execute({
            url: path,
            method: 'post',
            data: payload,
            withCredentials: authEnabled,
          })
            .then((response: AxiosResponse<Job>) => {
              navigate(forwardPath + response.data.id)
            })
            .catch((error) => {
              raiseError(error.toJSON())
            })
        }
      } else {
        execute({
          url: '/api/v1/requests',
          method: 'post',
          data: payload,
          withCredentials: authEnabled,
        })
          .then((response: AxiosResponse<Request>) => {
            navigate(forwardPath + response.data.id)
          })
          .catch((error) => {
            raiseError(error.toJSON())
          })
      }
    }
  }

  const widgets = {
    FileWidget: CustomFileWidget,
  }

  const submitFormRef = createRef<HTMLButtonElement>()
  const submitFormButtonText = isJob
    ? isReplay
      ? 'Update'
      : 'Schedule'
    : 'Execute'

  return (
    <Box p={2} display="flex" alignItems="flex-start">
      <Box width={3 / 5}>
        <BytesParameterContext.Provider
          value={{ fileMetaData, setFileMetaData }}
        >
          <Form
            schema={schema as unknown as JSONSchema7}
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
              <Button
                type="submit"
                onClick={() => submitFormRef.current?.click()}
              >
                {submitFormButtonText}
              </Button>
            </ButtonGroup>
          </Form>
        </BytesParameterContext.Provider>
      </Box>
      <Box pl={1} width={2 / 5} style={{ verticalAlign: 'top' }}>
        <JsonCard title="Preview" data={displayModel} />
      </Box>
      {submitStatus ? <Snackbar status={submitStatus} /> : null}
    </Box>
  )
}

export { BytesParameterContext, CommandViewForm }
