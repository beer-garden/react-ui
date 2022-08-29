import { Box, Button } from '@mui/material'
import { ErrorSchema, FormValidation, IChangeEvent } from '@rjsf/core'
import Form from '@rjsf/material-ui'
import { AxiosRequestConfig } from 'axios'
import { useMyAxios } from 'hooks/useMyAxios'
import { createContext, Dispatch, SetStateAction, useState } from 'react'
import ReactJson from 'react-json-view'
import { useNavigate } from 'react-router-dom'
import { AugmentedCommand, ObjectWithStringKeys } from 'types/custom-types'

import {
  cleanModelForDisplay,
  dataUrlToFile,
  handleByteParametersReset,
  isByteCommand,
} from './commandViewHelpers'
import { CustomFileWidget, FileMetaData } from './CustomFileWidget'
import { getSubmitArgument } from './form-data/get-submit-argument/get-submit-argument'
import { prepareModelForSubmit } from './form-data/get-submit-argument/prepare-model-for-submit'

interface CommandViewFormProps {
  schema: ObjectWithStringKeys
  uiSchema: Record<string, unknown>
  initialModel: ObjectWithStringKeys
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
  const initialData = initialModel

  const [model, setModel] = useState(initialData)
  const [displayModel, setDisplayModel] = useState(model)
  const [fileMetaData, setFileMetaData] = useState<FileMetaData[]>([])
  const { axiosInstance } = useMyAxios()
  const navigate = useNavigate()
  const hasByteParameters = isByteCommand(command.parameters)

  const onResetForm = () => {
    setModel(handleByteParametersReset(initialData, model, command.parameters))
  }

  const onFormUpdated = (
    changeEvent: IChangeEvent,
    es: ErrorSchema | undefined,
  ) => {
    const formData = changeEvent.formData
    setModel(formData)

    const cleanedModel = cleanModelForDisplay(formData, command.parameters)
    setDisplayModel(cleanedModel)
  }

  const raiseError = (message: string) => {
    // TODO: make this more useful
    console.error(message)
  }

  const handleError = (message: string) => {
    // this is meant to do nothing but swallow the error message;
    // the Form will automatically show validation messages in the UI and
    // having this *do nothing* function prevents those messages from also
    // being dumped to console.error
  }

  const onSubmit = () => {
    console.log('hasByteParameters', hasByteParameters)
    console.log('fileMetaData', fileMetaData)
    console.log('model', model)

    if (hasByteParameters && isJob) {
      raiseError('Bytes parameters are not supported for scheduled jobs')
      return
    }

    const argumentToSubmit = getSubmitArgument(
      model,
      command,
      isJob,
      hasByteParameters,
    )

    const payload = prepareModelForSubmit(
      argumentToSubmit,
      command.parameters,
      isJob,
    )

    const forwardPath = isJob ? '/jobs/' : '/requests/'

    if (hasByteParameters) {
      const data = new FormData()
      const config = {
        headers: { 'Content-type': 'multipart/form-data' },
      } as AxiosRequestConfig<FormData>

      data.append('request', JSON.stringify(payload))

      for (const fileData of fileMetaData) {
        const file = dataUrlToFile(fileData.dataUrl)
        data.append(fileData.parameterName as string, file, file.name)
      }

      axiosInstance
        .post('/api/v1/requests', data, config)
        .then((response) => {
          navigate(forwardPath + response.data.id)
        })
        .catch((error) => {
          raiseError(error.toJSON())
        })
    } else {
      const path = isJob ? '/api/v1/jobs' : '/api/v1/requests'

      axiosInstance
        .post(path, payload)
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
            <Button variant="contained" onClick={onResetForm} color="secondary">
              Reset
            </Button>
            &nbsp;&nbsp;
            <Button variant="contained" type="submit" onClick={onSubmit}>
              {isJob ? 'Schedule' : 'Execute'}
            </Button>
          </Form>
        </BytesParameterContext.Provider>
      </Box>
      <Box pl={1} width={2 / 5} style={{ verticalAlign: 'top' }}>
        <h3>Preview</h3>
        <ReactJson src={displayModel} />
      </Box>
    </Box>
  )
}

export { BytesParameterContext, CommandViewForm }
