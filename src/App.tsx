import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Redirect, Route, RouteComponentProps, Switch } from "react-router-dom";
import { AxiosResponse } from "axios";

import Menu from "./components/menu";
import SystemsApp from "./apps/system_index_app";
import RequestApp from "./apps/request_index_app";
import CommandsApp from "./apps/command_index_app";
import RequestViewApp from "./apps/request_view_app";
import SystemsAdminApp from "./apps/system_admin_app";
import GardensAdminApp from "./apps/garden_admin_app";
import JobsApp from "./apps/job_index_app";
import JobViewApp from "./apps/job_view_app";
import GardenViewApp from "./apps/garden_view_app";
import JobCreateApp from "./apps/job_create_app";
import CommandViewApp from "./apps/command_view_app";
import SystemsService from "./services/system_service";
import {
  CommandParams,
  GardenNameParam,
  System,
  IdParam,
} from "./custom_types/custom_types";

const App = (): JSX.Element => {
  const [systems, setSystems] = useState<System[]>([]);

  if (!systems[0]) {
    SystemsService.getSystems(successCallback);
  }

  function successCallback(response: AxiosResponse) {
    setSystems(response.data);
  }
  if (systems[0]) {
    return (
      <Box>
        <Menu />
        <Box px={2}>
          <Switch>
            <Route
              path="/systems/:namespace/:system_name/:version/commands/:command_name/"
              component={(routeProps: RouteComponentProps<CommandParams>) => (
                <CommandViewApp systems={systems} {...routeProps} />
              )}
            />
            <Route
              path="/systems/:namespace/:system_name/:version/"
              component={(routeProps: RouteComponentProps<CommandParams>) => (
                <CommandsApp systems={systems} {...routeProps} />
              )}
            />
            <Route
              path="/systems/:namespace/:system_name/"
              component={(routeProps: RouteComponentProps<CommandParams>) => (
                <CommandsApp systems={systems} {...routeProps} />
              )}
            />
            <Route
              path="/systems/:namespace/"
              component={(routeProps: RouteComponentProps<CommandParams>) => (
                <CommandsApp systems={systems} {...routeProps} />
              )}
            />
            <Route
              path="/systems"
              component={() => <SystemsApp systems={systems} />}
            />
            <Route
              path="/admin/systems"
              component={() => <SystemsAdminApp systems={systems} />}
            />
            <Route
              path="/admin/gardens/:garden_name/"
              component={(routeProps: RouteComponentProps<GardenNameParam>) => (
                <GardenViewApp {...routeProps} />
              )}
            />
            <Route
              path="/admin/gardens"
              component={() => <GardensAdminApp />}
            />
            <Route
              path="/requests/:id"
              component={(routeProps: RouteComponentProps<IdParam>) => (
                <RequestViewApp {...routeProps} />
              )}
            />
            <Route path="/requests" component={() => <RequestApp />} />
            <Route
              path="/jobs/create"
              component={(routeProps: RouteComponentProps) => (
                <JobCreateApp {...routeProps} />
              )}
            />
            <Route
              path="/jobs/:id"
              component={(routeProps: RouteComponentProps<IdParam>) => (
                <JobViewApp {...routeProps} />
              )}
            />
            <Route path="/jobs" component={() => <JobsApp />} />
            <Redirect to="/systems" />
          </Switch>
        </Box>
      </Box>
    );
  } else {
    return (
      <Box>
        <Menu />
        <Backdrop open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Box>
    );
  }
};

export default App;
