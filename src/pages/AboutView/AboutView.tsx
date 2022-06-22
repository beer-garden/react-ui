import { AppBar, Box, Card, CardContent, Divider, Toolbar, Typography } from '@mui/material'
import { makeStyles } from '@material-ui/core/styles'
import { ServerConfig } from 'containers/ConfigContainer'
import PageHeader from 'components/PageHeader'

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    margin: 15
  }
})

interface GardenAboutCardProps {
  config: ServerConfig|undefined
}

const AboutView = ({ config }: GardenAboutCardProps) => {
  const classes = useStyles()

  if (!config) return null

  return (
    <div>
      <PageHeader title={"About " + config.application_name} description="" />
      <Divider />
      <Box m={2} pt={2} display="flex" alignItems="flex-start">
        <Card variant="elevation" className={classes.root}>
          <AppBar color="inherit" style={{ background: 'lightgray' }} position="static">
            <Toolbar>
              <Typography variant="h6" color="inherit">
                Helpful Links
              </Typography>
            </Toolbar>
          </AppBar>
          <CardContent>
            <Typography variant="body2">
              <li>
                <a href={config.url_prefix + "swagger/index.html?config=" + config.url_prefix + "config/swagger"}
                  >Open API documentation</a>
                - {config.application_name} uses OpenAPI Documentation for our ReST Interface.
              </li>
              <li ng-if="config.metricsUrl">
                <a href={config.metrics_url}>Metrics</a> - Link to the configured metrics backend.
              </li>
            </Typography>
          </CardContent>
        </Card>
        <Card variant="elevation" className={classes.root}>
          <AppBar color="inherit" style={{ background: 'lightgray' }} position="static">
            <Toolbar>
              <Typography variant="h6" color="inherit">
                Version Information
              </Typography>
            </Toolbar>
          </AppBar>
          <CardContent>
            <Typography variant="body2">
              {config.application_name} is currently on version <b>{config.garden_name}</b>
            </Typography>
          </CardContent>
        </Card>
        <Card variant="elevation" className={classes.root}>
          <AppBar color="inherit" style={{ background: 'lightgray' }} position="static">
            <Toolbar>
              <Typography variant="h6" color="inherit">
                Component Status
              </Typography>
            </Toolbar>
          </AppBar>
          <CardContent>
            <Typography variant="body2">
              Listed below is the current status of the components
            </Typography>
            <Typography variant="body2">
              <b>Beer Garden:</b> RUNNING
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </div>
  )
}

export { AboutView }
