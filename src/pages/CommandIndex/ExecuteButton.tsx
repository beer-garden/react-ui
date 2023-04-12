import { GardensContext } from 'components/GardensContext'
import { JobRequestCreationContext } from 'components/JobRequestCreation'
import { LinkButton } from 'components/LinkButton'
import { PermissionsContainer } from 'containers/PermissionsContainer'
import { useContext } from 'react'
import { AugmentedCommand, StrippedSystem } from 'types/custom-types'

interface IExeButton {
  system: StrippedSystem
  command: AugmentedCommand
}

const ExecuteButton = ({ system, command }: IExeButton) => {
  const { namespace, systemName, systemVersion, name, systemId } = command
  const { hasSystemPermission } = PermissionsContainer.useContainer()
  const { gardens } = useContext(GardensContext)

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
        return LinkButton(
          'Execute',
          linkTo,
          !hasSystemPermission('request:create', systemId, namespace, gardens),
          onClickCallback,
        )
      }}
    </JobRequestCreationContext.Consumer>
  )
}

export { ExecuteButton }
