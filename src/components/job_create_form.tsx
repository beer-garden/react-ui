import React, { FC, useState } from 'react'
import { materialCells, materialRenderers } from '@jsonforms/material-renderers'
import { JsonForms } from '@jsonforms/react'
import Ajv from 'ajv'

import AlertForm from '../builderForm/customFormRenders/alert_control'
import AlertTester from '../builderForm/customFormRenders/alert_tester'
import DictionaryControl from '../builderForm/customFormRenders/dict_any_control'
import DictionaryTester from '../builderForm/customFormRenders/dict_any_tester'
import Button from '@material-ui/core/Button'
import { Redirect } from 'react-router'
import Tooltip from '@material-ui/core/Tooltip'
import JobService from '../services/job_service'
import { Request, SuccessCallback } from '../custom_types/custom_types'
import ReactJson from 'react-json-view'
import Box from '@material-ui/core/Box'
import { AxiosResponse } from 'axios'

interface JobViewFormProps {
  request: Request
}

const JobViewForm: FC<JobViewFormProps> = ({ request }: JobViewFormProps) => {
  const [model, setModel] = useState(JobService.MODEL)
  const [errors, setErrors] = useState<Ajv.ErrorObject[]>([])
  const [redirect, setRedirect] = useState<JSX.Element>()

  function submitForm(successCallback: SuccessCallback) {
    JobService.createJob(request, model, successCallback)
  }

  function successCallback(response: AxiosResponse) {
    setRedirect(<Redirect push to={'/jobs/'.concat(response.data.id)} />)
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
          schema={JobService.SCHEMA}
          uischema={JobService.UISCHEMA}
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
            setErrors(errors || [])
          }}
        />
        <Button
          variant="contained"
          onClick={() => setModel(JobService.MODEL)}
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
