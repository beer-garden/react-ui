import React, { BaseSyntheticEvent, FC } from "react";
import Divider from "@material-ui/core/Divider";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import StopIcon from "@material-ui/icons/Stop";
import CachedIcon from "@material-ui/icons/Cached";
import DeleteIcon from "@material-ui/icons/Delete";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Color } from "@material-ui/lab/Alert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import { Link as RouterLink } from "react-router-dom";
import LinkIcon from "@material-ui/icons/Link";
import { Select, Tooltip } from "@material-ui/core";
import Button from "@material-ui/core/Button";

import InstanceService from "../services/instance_service";
import SystemService from "../services/system_service";
import { Instance, System } from "../custom_types/custom_types";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
});

interface SystemAdminCardProps {
  systems: System[];
  namespace: string;
}

const SystemAdminCard: FC<SystemAdminCardProps> = ({
  systems,
}: SystemAdminCardProps) => {
  function getSeverity(status: string) {
    switch (status) {
      case "RUNNING":
        return "success";
      case "STOPPING":
      case "UNRESPONSIVE":
        return "warning";
      case "STARTING":
      case "INITIALIZING":
      case "RELOADING":
        return "info";
      case "DEAD":
      case "STOPPED":
        return "error";
      default:
        break;
    }
  }

  function getSystemsSeverity(systems: System[]) {
    let status: Color = "success";
    for (const i in systems) {
      const system = systems[i];
      for (const k in system.instances) {
        const instance = system.instances[k];
        if (
          (instance.status === "STOPPING" ||
            instance.status === "UNRESPONSIVE") &&
          status !== "error"
        ) {
          status = "warning";
        } else if (
          (instance.status === "STARTING" ||
            instance.status === "INITIALIZING" ||
            instance.status === "RELOADING") &&
          status !== "error" &&
          status !== "warning"
        ) {
          status = "info";
        } else if (
          (instance.status === "DEAD" || instance.status === "STOPPED") &&
          status !== "error"
        ) {
          status = "error";
          break;
        }
      }
    }
    return status;
  }

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [menuId, setMenuId] = React.useState("");

  function handleClick(event: BaseSyntheticEvent, id: string) {
    setMenuId(id);
    setAnchorEl(event.currentTarget);
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event: BaseSyntheticEvent) => {
    setSystemIndex(event.target.value);
  };

  const [systemIndex, setSystemIndex] = React.useState(0);

  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <AppBar
        color="inherit"
        style={{ background: "lightgray" }}
        position="static"
      >
        <Alert variant="outlined" severity={getSystemsSeverity(systems)}>
          <Typography variant="h6" color="inherit">
            {systems[0].name}
          </Typography>
        </Alert>
      </AppBar>
      <CardContent>
        <Grid alignItems="center" container>
          <Grid item key={"selector"}>
            <Select value={systemIndex} onChange={handleChange}>
              {systems.map((system, index) => (
                <MenuItem key={system.version} value={index}>
                  <Alert severity={getSystemsSeverity([system])}>
                    <AlertTitle>{system.version}</AlertTitle>
                  </Alert>
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item key={"systems[systemIndex] actions"}>
            <Toolbar variant="dense">
              <IconButton
                size="small"
                component={RouterLink}
                to={[
                  "/systems",
                  systems[systemIndex].namespace,
                  systems[systemIndex].name,
                  systems[systemIndex].version,
                ].join("/")}
              >
                <LinkIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={() =>
                  InstanceService.startSystem(systems[systemIndex])
                }
                aria-label="start"
              >
                <PlayCircleFilledIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => InstanceService.stopSystem(systems[systemIndex])}
                aria-label="stop"
              >
                <StopIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={() =>
                  SystemService.reloadSystem(systems[systemIndex].id)
                }
                aria-label="reload"
              >
                <CachedIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={() =>
                  SystemService.deleteSystem(systems[systemIndex].id)
                }
                aria-label="delete"
              >
                <DeleteIcon />
              </IconButton>
            </Toolbar>
          </Grid>
        </Grid>
        <Typography variant={"body2"} color="textSecondary">
          {systems[systemIndex].description}
        </Typography>
        <Divider />
        <Grid alignItems="center" container>
          {systems[systemIndex].instances.map((instance: Instance) => (
            <Grid item key={instance.name}>
              <Button
                onClick={(event) => handleClick(event, instance.id)}
                size="small"
              >
                <Tooltip arrow title={instance.status} placement="bottom-start">
                  <Alert severity={getSeverity(instance.status)}>
                    <Typography variant="body2">{instance.name}</Typography>
                  </Alert>
                </Tooltip>
              </Button>
              <Menu
                id="menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem
                  key="start"
                  onClick={() => {
                    handleClose();
                    InstanceService.startInstance(menuId);
                  }}
                >
                  Start
                  <PlayCircleFilledIcon />
                </MenuItem>
                <MenuItem
                  key="stop"
                  onClick={() => {
                    handleClose();
                    InstanceService.stopInstance(menuId);
                  }}
                >
                  Stop
                  <StopIcon />
                </MenuItem>
                <MenuItem key="logs" onClick={handleClose}>
                  Show Logs
                </MenuItem>
                <MenuItem key="queue" onClick={handleClose}>
                  Manage Queue
                </MenuItem>
              </Menu>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SystemAdminCard;
