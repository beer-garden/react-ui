import { UISchemaElement } from '@jsonforms/core'
import { materialCells, materialRenderers } from '@jsonforms/material-renderers'
import { JsonForms } from '@jsonforms/react'
import { Box, Button, Tooltip } from '@mui/material'
import { ErrorObject } from 'ajv'
import { AxiosRequestConfig } from 'axios'
import useAxios from 'axios-hooks'
import AlertForm from 'builderForm/customFormRenders/alert_control'
import AlertTester from 'builderForm/customFormRenders/alert_tester'
import DictionaryControl from 'builderForm/customFormRenders/dict_any_control'
import DictionaryTester from 'builderForm/customFormRenders/dict_any_tester'
import { useState } from 'react'
import ReactJson from 'react-json-view'
import { Link as RouterLink, Navigate } from 'react-router-dom'
import CacheService from 'services/cache_service'
import { Command } from 'types/backend-types'
import { ObjectWithStringKeys } from 'types/custom-types'

interface CommandViewFormProps {
  schema: ObjectWithStringKeys
  uiSchema: UISchemaElement
  initialModel: ObjectWithStringKeys
  command: Command
}

const CommandViewForm = ({
  schema,
  uiSchema,
  initialModel,
}: CommandViewFormProps) => {
  const initialData = initialModel

  const pourItAgainRequest = CacheService.popQueue(
    'lastKnownPourItAgainRequest',
  )
  if (pourItAgainRequest) {
    initialData.parameters = pourItAgainRequest.parameters
    initialData.instance_name = pourItAgainRequest.instance_name
    if (pourItAgainRequest.comment) {
      initialData.comment = pourItAgainRequest.comment
    }
  }

  const [model, setModel] = useState(initialData)
  // for some reason, error does not have `instancePath` which is required on ErrorObject
  const [errors, setErrors] = useState<Partial<ErrorObject>[]>([])
  const [redirect, setRedirect] = useState<JSX.Element>()

  const useCreateRefresh = () => {
    const config: AxiosRequestConfig = {
      url: '/api/v1/requests',
      method: 'POST',
      data: model,
    }

    const [{ response }] = useAxios(config)

    const onClick = () => {
      setRedirect(<Navigate to={'/requests/'.concat(response?.data.id)} />)
    }

    return onClick
  }

  const onClick = useCreateRefresh()

  let makeRequestElement = (
    <Button onClick={onClick} variant="contained" color="primary">
      Make Request
    </Button>
  )
  if (errors.length > 0) {
    makeRequestElement = (
      <Tooltip title="Missing required properties">
        <span>
          <Button disabled={true} variant="contained" color="primary">
            Make Request
          </Button>
        </span>
      </Tooltip>
    )
  }

  let createJobElement = (
    <Button
      component={RouterLink}
      to={{ pathname: '/jobs/create' }}
      state={{ request: model }}
      variant="contained"
      color="primary"
    >
      Create Job
    </Button>
  )
  if (errors.length > 0) {
    createJobElement = (
      <Tooltip title="Missing required properties">
        <span>
          <Button disabled={true} variant="contained" color="primary">
            Create Job
          </Button>
        </span>
      </Tooltip>
    )
  }

  function onChange(
    data: ObjectWithStringKeys,
    errors: Partial<ErrorObject>[],
  ) {
    setErrors(errors)
    setModel(data)
  }

  return (
    <Box pt={2} display="flex" alignItems="flex-start">
      {redirect}
      <Box width={3 / 4}>
        <JsonForms
          schema={schema}
          uischema={uiSchema}
          data={model}
          renderers={[
            ...materialRenderers,
            { tester: AlertTester, renderer: AlertForm },
            {
              tester: DictionaryTester,
              renderer: DictionaryControl,
            },
          ]}
          cells={materialCells}
          onChange={({ data, errors }) => {
            onChange(data, (errors || []) as Partial<ErrorObject>[])
          }}
        />
        <Button
          variant="contained"
          onClick={() => onChange(initialModel, [])}
          color="secondary"
        >
          Reset
        </Button>
        {makeRequestElement}
        {createJobElement}
      </Box>
      <Box pl={1} width={1 / 4} style={{ verticalAlign: 'top' }}>
        <h3>Preview</h3>
        <ReactJson src={model} />
      </Box>
    </Box>
  )
}

export default CommandViewForm
