import { materialCells, materialRenderers } from '@jsonforms/material-renderers'
import { JsonForms } from '@jsonforms/react'
import { Box, Button, Tooltip } from '@mui/material'
import { ErrorObject } from 'ajv'
import { AxiosResponse } from 'axios'
import AlertForm from 'builderForm/customFormRenders/alert_control'
import AlertTester from 'builderForm/customFormRenders/alert_tester'
import DictionaryControl from 'builderForm/customFormRenders/dict_any_control'
import DictionaryTester from 'builderForm/customFormRenders/dict_any_tester'
import { useState } from 'react'
import ReactJson from 'react-json-view'
import { Navigate } from 'react-router-dom'
import { useJobServices } from 'services/job.service/job.service'
import {
  MODEL,
  SCHEMA,
  UISCHEMA,
} from 'services/job.service/job-service-values'
import { Request } from 'types/backend-types'
import { SuccessCallback } from 'types/custom-types'

interface JobViewFormProps {
  request: Request
}

const JobViewForm = ({ request }: JobViewFormProps) => {
  const [model, setModel] = useState(MODEL)
  // for some reason, error does not have `instancePath` which is required on ErrorObject
  const [errors, setErrors] = useState<Partial<ErrorObject>[]>([])
  const [redirect, setRedirect] = useState<JSX.Element>()
  const { createJob } = useJobServices()

  function submitForm(successCallback: SuccessCallback) {
    createJob(request, model, successCallback)
  }

  function successCallback(response: AxiosResponse) {
    setRedirect(<Navigate to={'/jobs/'.concat(response.data.id)} />)
  }

  function makeRequest() {
    if (errors.length > 0) {
      return (
        <Tooltip title="Missing required properties">
          <span>
            <Button disabled={true} variant="contained" color="primary">
              Create Job
            </Button>
          </span>
        </Tooltip>
      )
    } else {
      return (
        <Button
          onClick={() => submitForm(successCallback)}
          variant="contained"
          color="primary"
        >
          Create Job
        </Button>
      )
    }
  }

  return (
    <Box display="flex" alignItems="flex-start">
      <Box width={3 / 4}>
        {redirect}
        <JsonForms
          schema={SCHEMA}
          uischema={UISCHEMA}
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
            setModel(data)
            setErrors((errors || []) as Partial<ErrorObject>[])
          }}
        />
        <Button
          variant="contained"
          onClick={() => setModel(MODEL)}
          color="secondary"
        >
          Reset
        </Button>

        {makeRequest()}
      </Box>

      <Box pl={1} width={1 / 4} style={{ verticalAlign: 'top' }}>
        <h3>Preview</h3>
        <ReactJson src={model} />
      </Box>
    </Box>
  )
}

export default JobViewForm
