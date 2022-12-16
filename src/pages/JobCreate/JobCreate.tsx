import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CancelIcon from '@mui/icons-material/Cancel'
import { Backdrop, Box, Button, CircularProgress } from '@mui/material'
import { AxiosError } from 'axios'
import { Divider } from 'components/Divider'
import { ErrorAlert } from 'components/ErrorAlert'
import { PageHeader } from 'components/PageHeader'
import { JobCreateCommandsTable } from 'pages/JobCreate/JobCreateCommandsTable'
import { JobCreateForwarder } from 'pages/JobCreate/JobCreateForwarder'
import { JobCreateSystemsTable } from 'pages/JobCreate/JobCreateSystemsTable'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Command, System } from 'types/backend-types'

const DEBUG_DISPATCH_FUNCTIONS = false

const JobCreate = () => {
  const [system, _setSystem] = useState<System | undefined>(undefined)
  const [command, _setCommand] = useState<Command | undefined>(undefined)
  const [error, setError] = useState<AxiosError>()
  const navigate = useNavigate()

  const setSystem = (system: System) => {
    if (DEBUG_DISPATCH_FUNCTIONS) console.log('Setting system:', system)
    _setSystem(system)
  }
  const setCommand = (command: Command) => {
    if (DEBUG_DISPATCH_FUNCTIONS) console.log('Setting command:', command)
    _setCommand(command)
  }
  const cancelJob = () => {
    _setSystem(undefined)
    _setCommand(undefined)
    navigate('/jobs')
  }
  const backToSystem = () => {
    _setSystem(undefined)
    _setCommand(undefined)
  }

  const cancelAllSchedulingButton = (
    <Button size="small" onClick={cancelJob} startIcon={<CancelIcon />}>
      Cancel Scheduling
    </Button>
  )

  return error ? (
    error.response ? (
      <ErrorAlert
        statusCode={error.response.status}
        errorMsg={error.response.statusText}
      />
    ) : (
      <Backdrop open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    )
  ) : !system ? (
    <Box>
      <PageHeader title="Choose System For Job" description="" />
      <Divider />
      <JobCreateSystemsTable systemSetter={setSystem} errorSetter={setError}>
        {cancelAllSchedulingButton}
      </JobCreateSystemsTable>
    </Box>
  ) : !command ? (
    <Box>
      <PageHeader
        title={`Choose Command from '${system.name}'`}
        description=""
      />
      <Divider />
      <JobCreateCommandsTable
        system={system as System}
        commandSetter={setCommand}
      >
        <Button
          size="small"
          onClick={backToSystem}
          startIcon={<ArrowBackIcon />}
        >
          Back
        </Button>
        {cancelAllSchedulingButton}
      </JobCreateCommandsTable>
    </Box>
  ) : (
    <JobCreateForwarder
      system={system as System}
      command={command as Command}
    />
  )
}

export { JobCreate }
