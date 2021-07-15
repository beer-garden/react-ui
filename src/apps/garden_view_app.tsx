import React, { FC, useState } from "react";
import Box from "@material-ui/core/Box";
import { match as Match, RouteComponentProps } from "react-router-dom";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Alert from "@material-ui/lab/Alert";

import Divider from "../components/divider";
import Table from "../components/table";
import InfoCard from "../components/garden_admin_info_card";
import PageHeader from "../components/page_header";
import GardenForm from "../components/garden_view_form";
import GardenService from "../services/garden_service";
import {
  Garden,
  GardenNameParam,
  System,
  TableState,
} from "../custom_types/custom_types";
import { AxiosResponse } from "axios";
import { systemLink } from "../services/routing_links";

interface MyProps extends RouteComponentProps<GardenNameParam> {
  match: Match<GardenNameParam>;
}
type FormState = {
  dataForm: any;
  errors: any[];
};

const GardenViewApp: FC<MyProps> = ({ match }: MyProps) => {
  const schema = GardenService.SCHEMA;
  const uischema = GardenService.UISCHEMA;
  const initialModel = {};
  const [garden, setGarden] = useState<Garden>();
  const state: TableState = {
    completeDataSet: [],
    formatData: formatData,
    cacheKey: `lastKnown_${window.location.href}`,
    includePageNav: true,
    disableSearch: true,
    tableHeads: ["Namespace", "System", "Version"],
  };
  if (garden) {
    state.completeDataSet = garden.systems;
  }
  const formState: FormState = {
    dataForm: {},
    errors: [],
  };
  const title = "Garden View";
  const garden_name = match.params.garden_name;

  if (!garden) {
    GardenService.getGarden(successCallback, garden_name);
  }

  function formatData(systems: System[]) {
    const tempData: (string | JSX.Element | number)[][] = [];
    for (const i in systems) {
      tempData[i] = [
        systemLink(systems[i].namespace, [systems[i].namespace]),
        systemLink(systems[i].name, [systems[i].namespace, systems[i].name]),
        systemLink(systems[i].version, [
          systems[i].namespace,
          systems[i].name,
          systems[i].version,
        ]),
      ];
    }
    return tempData;
  }

  function successCallback(response: AxiosResponse) {
    setGarden(response.data);
  }

  function getConfigSetup() {
    if (garden) {
      if (garden.connection_type === "LOCAL") {
        return (
          <Alert severity="info">
            {
              "Since this is the local Garden it's not possible to modify connection information"
            }
          </Alert>
        );
      } else {
        //todo fix
        // return (
        // <GardenForm self={this} schema={schema} uischema={uischema} />
        // );
      }
    }
  }

  function renderComponents() {
    if (garden) {
      return (
        <Box>
          <InfoCard garden={garden} />
          <Typography variant="h6">Connected Systems</Typography>
          <Table parentState={state} />
          <Box pt={1}>
            <Typography variant="h6">Update Connection</Typography>
          </Box>
          {getConfigSetup()}
        </Box>
      );
    } else {
      return (
        <Backdrop open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      );
    }
  }
  return (
    <Box pb={10}>
      <Grid justify="space-between" container>
        <Grid item>
          <PageHeader title={title} description={""} />
        </Grid>
        <Grid item>
          <Typography style={{ flex: 1 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => GardenService.syncGarden(garden_name)}
            >
              Sync
            </Button>
          </Typography>
        </Grid>
      </Grid>
      <Divider />
      {renderComponents()}
    </Box>
  );
};

export default GardenViewApp;
