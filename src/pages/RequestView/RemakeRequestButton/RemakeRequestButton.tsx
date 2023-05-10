import { Button } from '@mui/material'
import { JobRequestCreationContext } from 'components/JobRequestCreation'
import { useMountedState } from 'hooks/useMountedState'
import { useSystems } from 'hooks/useSystems'
import { CannotReExecuteButton } from 'pages/RequestView/RemakeRequestButton'
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Request, RequestTemplate } from 'types/backend-types'
import { SystemCommandPair } from 'types/custom-types'
import { commandsPairer, systemFilter } from 'utils/commandFormatters'

interface RemakeRequestButtonProps {
  request: Request
}

const RemakeRequestButton = ({ request }: RemakeRequestButtonProps) => {
  const navigate = useNavigate()
  const { getSystems } = useSystems()
  const [systemCommandPair, setSystemCommandPair] = useMountedState<
    SystemCommandPair | undefined
  >()
  const { setSystem, setCommand, setIsJob, setRequestModel, setIsReplay } =
    useContext(JobRequestCreationContext)
  const {
    command: commandName,
    system: systemName,
    system_version: systemVersion,
    namespace,
  } = request

  useEffect(() => {
    getSystems().then((response) => {
      setSystemCommandPair(
        response.data
          .filter(systemFilter(systemName, systemVersion, namespace))
          .map(commandsPairer)
          .flat()
          .filter((p: SystemCommandPair) => p.command.name === commandName)
          .pop(),
      )
    })
  }, [
    commandName,
    getSystems,
    namespace,
    setSystemCommandPair,
    systemName,
    systemVersion,
  ])

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
  if (!systemCommandPair) {
    return (
      <CannotReExecuteButton message="ERROR: System or Command not available" />
    )
  }

  const model: RequestTemplate = {
    system: request.system,
    system_version: request.system_version,
    namespace: request.namespace,
    command: request.command,
    comment: request.comment || '',
    output_type: request.output_type,
    instance_name: request.instance_name,
    parameters: request.parameters
  }

  const onClick = () => {
    setSystem(systemCommandPair.system)
    setCommand(systemCommandPair.command)
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
      Remake Request
    </Button>
  )
}

export { RemakeRequestButton }
