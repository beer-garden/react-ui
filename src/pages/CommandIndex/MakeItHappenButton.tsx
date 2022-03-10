import { Button } from '@mui/material'
import { Command } from '../../types/custom_types'
import { Link as RouterLink } from 'react-router-dom'

const MakeItHappenButton = (command: Command) => {
  const { namespace, systemName, systemVersion, name } = command

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
      size="small"
      variant="contained"
      color="primary"
    >
      Execute
    </Button>
  )
}

export default MakeItHappenButton
