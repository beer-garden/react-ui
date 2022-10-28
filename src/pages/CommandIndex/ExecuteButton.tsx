import { Button } from '@mui/material'
import { JobRequestCreationContext } from 'components/JobRequestCreation'
import { PermissionsContainer } from 'containers/PermissionsContainer'
import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { AugmentedCommand, StrippedSystem } from 'types/custom-types'

interface IExeButton {
  system: StrippedSystem
  command: AugmentedCommand
}

const ExecuteButton = ({ system, command }: IExeButton) => {
  const { namespace, systemName, systemVersion, name, systemId } = command
  const { hasSystemPermission } = PermissionsContainer.useContainer()
  const [permission, setPermission] = useState(false)

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [namespace, systemId])

  return (
    <JobRequestCreationContext.Consumer>
      {({ setSystem, setCommand, setIsJob }) => {
        const onClickCallback = () => {
          setSystem && setSystem(system)
          setCommand && setCommand(command)
          setIsJob && setIsJob(false)
        }
        return (
          <Button
            component={RouterLink}
            to={[
              '/systems',
              namespace,
              systemName,
              systemVersion,
              'commands',
              name,
            ].join('/')}
            onClick={onClickCallback}
            size="small"
            variant="contained"
            color="primary"
            disabled={permission}
          >
            Execute
          </Button>
        )
      }}
    </JobRequestCreationContext.Consumer>
  )
}

export { ExecuteButton }
