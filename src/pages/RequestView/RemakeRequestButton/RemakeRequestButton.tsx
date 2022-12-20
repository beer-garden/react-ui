import { Button } from '@material-ui/core'
import { JobRequestCreationContext } from 'components/JobRequestCreation'
import { useCommandsParameterized } from 'hooks/useCommandsParameterized'
import {
  CannotReExecuteButton,
  systemCommandPairFromArgs,
} from 'pages/RequestView/RemakeRequestButton/remakeRequestButtonHelpers'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Request } from 'types/backend-types'
import { SystemCommandPair } from 'types/custom-types'
import {
  CommandViewModelComment,
  CommandViewModelParameters,
  CommandViewRequestModel,
} from 'types/form-model-types'

interface RemakeRequestButtonProps {
  request: Request
}

const RemakeRequestButton = ({ request }: RemakeRequestButtonProps) => {
  const navigate = useNavigate()
  const { setSystem, setCommand, setIsJob, setRequestModel, setIsReplay } =
    useContext(JobRequestCreationContext)
  const {
    command: commandName,
    system: systemName,
    system_version: systemVersion,
    namespace,
    instance_name: instanceName,
    parameters: theParameters,
    comment: theComment,
  } = request
  const { commands: systemCommandPair } =
    useCommandsParameterized<SystemCommandPair>(
      systemCommandPairFromArgs(
        commandName,
        systemName,
        systemVersion,
        namespace,
      ),
    )

  if (
    !setSystem ||
    !setCommand ||
    !setIsJob ||
    !setRequestModel ||
    !setIsReplay
  ) {
    return <CannotReExecuteButton message="ERROR: Unknown error" />
  } else if (!request) {
    return <CannotReExecuteButton message="ERROR: Request not available" />
  }

  const pair = systemCommandPair.pop()
  if (!pair) {
    return (
      <CannotReExecuteButton message="ERROR: System or Command not available" />
    )
  }

  const model: CommandViewRequestModel = {
    comment: { comment: theComment || '' } as CommandViewModelComment,
    instance_names: { instance_name: instanceName },
    parameters: theParameters as CommandViewModelParameters,
  }

  const onClick = () => {
    setSystem(pair.system)
    setCommand(pair.command)
    setIsJob(false)
    setIsReplay(true)
    setRequestModel(model)
    navigate(
      [
        '/systems',
        namespace,
        systemName,
        systemVersion,
        'commands',
        commandName,
      ].join('/'),
    )
  }

  return (
    <Button
      variant="contained"
      color="primary"
      style={{ float: 'right' }}
      onClick={onClick}
    >
      {'Remake Request'}
    </Button>
  )
}

export { RemakeRequestButton }
