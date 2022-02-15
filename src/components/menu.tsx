import { makeStyles } from '@material-ui/core/styles' // TODO
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import png from '../fa-beer.png'
import AdminMenu from './admin_menu'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  toolbar: theme.mixins.toolbar,
}))

const MenuTabs = (): JSX.Element => {
  const classes = useStyles()

  return (
    <Box className={classes.root}>
      <AppBar color="inherit" position="fixed">
        <Toolbar variant="dense">
          <img src={png} alt={''} />
          <Typography style={{ flex: 1 }} variant="h6" color="inherit">
            Beer Garden
          </Typography>
          <Box display="flex" alignItems="center">
            <Box>
              <Button component={RouterLink} to="/systems">
                Systems
              </Button>
            </Box>
            <Box>
              <Button component={RouterLink} to="/requests">
                Requests
              </Button>
            </Box>
            <Box>
              <Button component={RouterLink} to="/jobs">
                Scheduler
              </Button>
            </Box>
            <Box>
              <AdminMenu />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Box className={classes.toolbar} />
    </Box>
  )
}

export default MenuTabs
