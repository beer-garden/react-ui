import { JobRequestCreationContext } from 'components/JobRequestCreation'
import { LinkButton } from 'components/LinkButton'
import { PermissionsContainer } from 'containers/PermissionsContainer'
import { useMountedState } from 'hooks/useMountedState'
import { useEffect } from 'react'
import { AugmentedCommand, StrippedSystem } from 'types/custom-types'

interface IExeButton {
  system: StrippedSystem
  command: AugmentedCommand
}

const ExecuteButton = ({ system, command }: IExeButton) => {
  const { namespace, systemName, systemVersion, name, systemId } = command
  const { hasSystemPermission } = PermissionsContainer.useContainer()
  const [permission, setPermission] = useMountedState<boolean>(false)

  useEffect(() => {
    const fetchPermission = async () => {
      const permCheck = await hasSystemPermission(
        'request:create',
        namespace,
        systemId,
      )
      setPermission(permCheck || false)
    }
    fetchPermission()
  }, [hasSystemPermission, namespace, setPermission, systemId])

  const linkTo = [
    '/systems',
    namespace,
    systemName,
    systemVersion,
    'commands',
    name,
  ].join('/')

  return (
    <JobRequestCreationContext.Consumer>
      {({ setSystem, setCommand, setIsJob }) => {
        const onClickCallback = () => {
          setSystem && setSystem(system)
          setCommand && setCommand(command)
          setIsJob && setIsJob(false)
        }
        return LinkButton('Execute', linkTo, !permission, onClickCallback)
      }}
    </JobRequestCreationContext.Consumer>
  )
}

export { ExecuteButton }
