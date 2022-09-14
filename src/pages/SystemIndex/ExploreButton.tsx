import { Button } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { System } from 'types/backend-types'

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
      color="secondary"
    >
      Explore
    </Button>
  )
}

export { ExploreButton }
