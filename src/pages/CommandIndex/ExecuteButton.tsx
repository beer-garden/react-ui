import { Button } from '@mui/material'
import { JobRequestCreationContext } from 'components/JobRequestCreation'
import { Link as RouterLink } from 'react-router-dom'
import { AugmentedCommand, StrippedSystem } from 'types/custom-types'

const ExecuteButton = (system: StrippedSystem, command: AugmentedCommand) => {
  const { namespace, systemName, systemVersion, name } = command

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
          >
            Execute
          </Button>
        )
      }}
    </JobRequestCreationContext.Consumer>
  )
}

export { ExecuteButton }
