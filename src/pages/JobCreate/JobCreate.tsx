import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CancelIcon from '@mui/icons-material/Cancel'
import { Button } from '@mui/material'
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

  return !system ? (
    <JobCreateSystemsTable systemSetter={setSystem}>
      {cancelAllSchedulingButton}
    </JobCreateSystemsTable>
  ) : !command ? (
    <JobCreateCommandsTable
      system={system as System}
      commandSetter={setCommand}
    >
      <Button size="small" onClick={backToSystem} startIcon={<ArrowBackIcon />}>
        Back
      </Button>
      {cancelAllSchedulingButton}
    </JobCreateCommandsTable>
  ) : (
    <JobCreateForwarder
      system={system as System}
      command={command as Command}
    />
  )
}

export { JobCreate }
