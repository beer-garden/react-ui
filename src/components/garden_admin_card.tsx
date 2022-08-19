import { makeStyles } from '@material-ui/core/styles' // TODO
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
import { Link as RouterLink } from 'react-router-dom'
import GardenService from 'services/garden_service'
import { Garden } from 'types/backend-types'
import { TableState } from 'types/custom-types'

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
})

interface GardenAdminCardProps {
  garden: Garden
}

const GardenAdminCard = ({ garden }: GardenAdminCardProps) => {
  const classes = useStyles()

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
          onClick={() => GardenService.deleteGarden(garden.name)}
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
    <Card className={classes.root}>
      <AppBar
        color="inherit"
        style={{ background: 'lightgray' }}
        position="static"
      >
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
