import { Button, Tooltip } from '@material-ui/core'
import { commandsPairer } from 'hooks/useCommands'
import { CommandFormatter } from 'hooks/useCommandsParameterized'
import { System } from 'types/backend-types'
import { SystemCommandPair } from 'types/custom-types'

interface CannotReExecuteButtonProps {
  message: string
}

const CannotReExecuteButton = ({ message }: CannotReExecuteButtonProps) => {
  return (
    <Tooltip title={message} data-testid="cannot-execute-button">
      <Button
        component="div"
        disabled
        variant="contained"
        color="secondary"
        style={{ float: 'right', pointerEvents: 'auto' }}
      >
        {'Remake Request'}
      </Button>
    </Tooltip>
  )
}

/**
 * From the arguments, creates a function that returns an array of maximum
 * length 1 of system/command pair that can be passed to useCommands.
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

export { CannotReExecuteButton, systemCommandPairFromArgs }
