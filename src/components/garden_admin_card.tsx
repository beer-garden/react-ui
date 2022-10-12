import {
  AppBar,
  Button,
  Card,
  CardActions,
  CardContent,
  Toolbar,
  Typography,
} from '@mui/material'
import Table from 'components/table'
import useGardens from 'hooks/useGardens'
import { Link as RouterLink } from 'react-router-dom'
import { Garden } from 'types/backend-types'
import { TableState } from 'types/custom-types'

interface GardenAdminCardProps {
  garden: Garden
}

const GardenAdminCard = ({ garden }: GardenAdminCardProps) => {
  const { deleteGarden } = useGardens()
  function getTableData() {
    return [
      ['Status', garden.status],
      ['Namespaces', garden.namespaces.length],
      ['Systems', garden.systems.length],
    ]
  }

  const state: TableState = {
    formatData: getTableData,
    tableHeads: [],
    includePageNav: false,
    disableSearch: true,
  }

  function getDeleteButton(connection_type: string) {
    if (connection_type !== 'LOCAL') {
      return (
        <Button
          onClick={() => deleteGarden(garden.name)}
          variant="contained"
          color="secondary"
        >
          Delete {garden.name}
        </Button>
      )
    }
  }

  function localOrRemote(connection_type: string) {
    if (connection_type === 'LOCAL') {
      return '(LOCAL)'
    } else {
      return '(REMOTE)'
    }
  }

  return (
    <Card sx={{ minWidth: 275 }}>
      <AppBar color="inherit" position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            {garden.name} {localOrRemote(garden.connection_type)}
          </Typography>
        </Toolbar>
      </AppBar>
      <CardContent>
        <Table parentState={state} />
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          color="primary"
          component={RouterLink}
          to={'/admin/gardens/' + garden.name}
        >
          Edit {garden.name} configurations
        </Button>
        {getDeleteButton(garden.connection_type)}
      </CardActions>
    </Card>
  )
}

export default GardenAdminCard
