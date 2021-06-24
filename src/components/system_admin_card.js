import React from 'react';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import StopIcon from '@material-ui/icons/Stop';
import CachedIcon from '@material-ui/icons/Cached';
import DeleteIcon from '@material-ui/icons/Delete';
import ViewHeadlineIcon from '@material-ui/icons/ViewHeadline';
import Alert from '@material-ui/lab/Alert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import { Link as RouterLink } from 'react-router-dom';

import InstanceService from '../services/instance_service'
import SystemService from '../services/system_service'

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
});

const SystemAdminCard =({self, systems}) => {

    function getSeverity(status) {
        switch(status) {
          case "RUNNING":
            return "success";
          case "STOPPING":
          case 'UNRESPONSIVE':
            return "warning";
          case "STARTING":
          case 'INITIALIZING':
            return "info";
          case "RELOADING":
            return "primary";
          case 'DEAD':
          case 'STOPPED':
            return "error";
          default:
            break;
        }
    }

    const [anchorEl, setAnchorEl] = React.useState(null);

      const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };

      const handleClose = () => {
        setAnchorEl(null);
      };

    const classes = useStyles();

    return (


    <Card className={classes.root}>
      <AppBar color="inherit" style={{ background: 'lightgray' }} position="static">
          <Toolbar>
              <Typography variant="h6" color="inherit" type="title">{systems[0].name}</Typography>
          </Toolbar>
      </AppBar>
      <CardContent>
        {(systems).map((system) => (
            <Box pt={1} key={system.name+system.version+"box"}>
            <Card className={classes.root}>
                <CardContent>
                <Grid
                      justify="space-between" // Add it here :)
                      alignItems="center"
                      container
                    >
                      <Grid item key={system.namespace+"/"+system.version}>
                            <Typography variant="h6" component={RouterLink} to={['/systems',system.namespace, system.name, system.version].join('/')} >
                              {system.namespace}/{system.version}
                            </Typography>
                        </Grid>
                        <Grid item key={"system actions"}>
                            <Toolbar variant='dense' >
                              <IconButton onClick={() => InstanceService.startSystem(system)} variant="contained" aria-label="start">
                                  <PlayCircleFilledIcon />
                              </IconButton>
                              <IconButton onClick={() => InstanceService.stopSystem(system)} variant="contained" aria-label="stop">
                                  <StopIcon />
                              </IconButton>
                              <IconButton onClick={() => SystemService.reloadSystem(system.id)} variant="contained" aria-label="reload">
                                  <CachedIcon />
                              </IconButton>
                              <IconButton onClick={() => SystemService.deleteSystem(system.id)} variant="contained" aria-label="delete">
                                  <DeleteIcon />
                              </IconButton>
                            </Toolbar>
                        </Grid>
                    </Grid>
                    <Typography className={classes.pos} color="textSecondary">
                      {system.description}
                    </Typography>
                    {(system.instances
                      ).map((instance, index) => (
                          <Box key={instance.name+index}>
                              <Divider />
                              <Grid
                                justify="space-between" // Add it here :)
                                alignItems="center"
                                container
                              >
                                <Grid item key={instance.name}>
                                      <Box pt={1} display="flex"
                                             alignItems="center"
                                      >
                                        <Box pr={1}>
                                          <Alert variant="filled" icon={false} severity={getSeverity(instance.status)}>
                                            {instance.status}
                                          </Alert>
                                        </Box>
                                        <Box>
                                          <Typography>
                                            {instance.name}
                                          </Typography>
                                        </Box>
                                      </Box>
                                  </Grid>
                                  <Grid item key={"instance actions"}>
                                      <Toolbar variant='dense' >
                                          <IconButton onClick={() => InstanceService.startInstance(instance.id)} variant="contained" aria-label="start">
                                              <PlayCircleFilledIcon />
                                          </IconButton>
                                          <IconButton onClick={() => InstanceService.stopInstance(instance.id)} variant="contained" aria-label="stop">
                                              <StopIcon />
                                          </IconButton>
                                          <IconButton variant="contained" onClick={handleClick} aria-label="logs">
                                              <ViewHeadlineIcon />
                                          </IconButton>
                                          <Menu
                                            id="simple-menu"
                                            anchorEl={anchorEl}
                                            keepMounted
                                            open={Boolean(anchorEl)}
                                            onClose={handleClose}
                                          >
                                            <MenuItem onClick={handleClose}>Show Logs</MenuItem>
                                            <MenuItem onClick={handleClose}>Manage Queue</MenuItem>
                                          </Menu>
                                      </Toolbar>
                                  </Grid>
                              </Grid>
                          </Box>
                    ))}
                </CardContent>
            </Card>
            </Box>
        ))}

      </CardContent>
    </Card>
    );
}

export default SystemAdminCard