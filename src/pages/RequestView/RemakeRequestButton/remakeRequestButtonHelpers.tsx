import { Button, Tooltip } from '@material-ui/core'
import { CommandFormatter, commandsPairer } from 'hooks/useCommands'
import { Request } from 'types/backend-types'
import { System } from 'types/backend-types'
import { SystemCommandPair } from 'types/custom-types'

const buttonText = 'Remake Request'

/* This is necessary to satisfy the "law of hooks" in RemakeRequestButton.tsx */
const DummyRequest: Request = {
  children: [],
  command: '',
  command_type: '',
  comment: '',
  created_at: 0,
  error_class: null,
  instance_name: '',
  namespace: '',
  output_type: '',
  parameters: {},
  parent: null,
  status: '',
  system: '',
  system_version: '',
  updated_at: 0,
}

interface CannotReExecuteButtonProps {
  message: string
}

const CannotReExecuteButton = ({ message }: CannotReExecuteButtonProps) => {
  return (
    <Tooltip title={message}>
      <Button
        component="div"
        disabled
        variant="contained"
        color="secondary"
        style={{ float: 'right', pointerEvents: 'auto' }}
      >
        {buttonText}
      </Button>
    </Tooltip>
  )
}

/**
 * From the arguments, creates a function that returns an array of maximum
 * length 1 of system/command pair that can be passed to usedCommands.
 *
 * @param commandName
 * @param systemName
 * @param systemVersion
 * @param namespace
 * @returns function
 */
const systemCommandPairFromArgs = (
  commandName: string,
  systemName: string,
  systemVersion: string,
  namespace: string,
): CommandFormatter<SystemCommandPair> => {
  return (systems: System[]) => {
    const filtered = systems.filter(
      (s: System) =>
        s.name === systemName &&
        s.version === systemVersion &&
        s.namespace === namespace,
    )
    const pairs = filtered.map(commandsPairer).flat()
    return pairs.filter(
      (p: SystemCommandPair) => p.command.name === commandName,
    )
  }
}

export {
  buttonText,
  CannotReExecuteButton,
  DummyRequest,
  systemCommandPairFromArgs,
}
