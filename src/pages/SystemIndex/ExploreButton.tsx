import { Button } from '@mui/material'
import { System } from '../../types/custom_types'
import { Link as RouterLink } from 'react-router-dom'

const ExploreButton = (system: System) => {
  const linkTo = [
    '/systems',
    system.namespace,
    system.name,
    system.version,
  ].join('/')

  return (
    <Button
      size="small"
      component={RouterLink}
      to={linkTo}
      variant="contained"
      color="primary"
    >
      Explore
    </Button>
  )
}

export default ExploreButton
