import React, { FC, useState } from "react";
import Box from "@material-ui/core/Box";
import ReactJson from "react-json-view";
import {
  Link as RouterLink,
  RouteComponentProps,
  match as Match,
} from "react-router-dom";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import Grid from "@material-ui/core/Grid";

import Divider from "../components/divider";
import RequestsTable from "../components/table";
import PageHeader from "../components/page_header";
import RequestService from "../services/request_service";
import { IdParam, Request, TableState } from "../custom_types/custom_types";
import Breadcrumbs from "../components/breadcrumbs";
import { AxiosResponse } from "axios";

interface MyProps extends RouteComponentProps<IdParam> {
  match: Match<IdParam>;
}

const RequestViewApp: FC<MyProps> = ({ match }: MyProps) => {
  const [request, setRequest] = useState<Request>();
  const requestService = new RequestService();
  let filename = "";
  const parameterOutputWidth = 1;
  const [expandOutput, setExpandOutput] = useState(false);
  const [expandParameter, setExpandParameter] = useState(false);
  const { id } = match.params;
  const state: TableState = {
    completeDataSet: [],
    formatData: formatData,
    includePageNav: false,
    disableSearch: true,
    tableHeads: ["Instance Name", "Status", "Created", "Updated", "Comment"],
  };
  const title = "Request View";
  function formatData(requests: Request[]) {
    const tempData: (string | JSX.Element | number | null)[][] = [];
    for (const i in requests) {
      tempData[i] = [
        requests[i].instance_name,
        requests[i].status,
        new Date(requests[i].created_at).toString(),
        new Date(requests[i].updated_at).toString(),
        requests[i].comment,
      ];
    }
    return tempData;
  }

  function successCallback(response: AxiosResponse) {
    setRequest(response.data);
  }

  function outputFormatted(request: Request) {
    if (["SUCCESS", "CANCELED", "ERROR"].includes(request.status)) {
      const output = request.output;
      const output_type = request.output_type;
      if (output_type === "STRING") {
        return <span>{output}</span>;
      } else if (output_type === "JSON") {
        return <ReactJson src={JSON.parse(output)} />;
      } else if (output_type === "HTML") {
        return <div dangerouslySetInnerHTML={{ __html: output }} />;
      }
    } else {
      return <CircularProgress color="inherit" />;
    }
  }

  function getExpandElement() {
    if (expandParameter || expandOutput) {
      return <ExpandLessIcon />;
    } else {
      return <ExpandMoreIcon />;
    }
  }

  function outputBox(request: Request) {
    if (!expandParameter) {
      return (
        <Box width={parameterOutputWidth}>
          <Grid justify="space-between" container>
            <Grid item>
              <Typography variant="h6">Outputs</Typography>
            </Grid>
            <Grid item>
              <Typography style={{ flex: 1 }}>
                <IconButton
                  size="small"
                  onClick={() => setExpandOutput(!expandOutput)}
                  aria-label="expand"
                >
                  {getExpandElement()}
                </IconButton>
              </Typography>
            </Grid>
          </Grid>
          <Box
            border={1}
            borderColor="lightgrey"
            bgcolor="whitesmoke"
            borderRadius="borderRadius"
          >
            <Box p={2}>{outputFormatted(request)}</Box>
          </Box>
        </Box>
      );
    }
  }

  function parameterBox(request: Request) {
    if (!expandOutput) {
      return (
        <Box
          pl={1}
          width={parameterOutputWidth}
          style={{ verticalAlign: "top" }}
        >
          <Grid justify="space-between" container>
            <Grid item>
              <Typography variant="h6">Parameters</Typography>
            </Grid>
            <Grid item>
              <Typography style={{ flex: 1 }}>
                <IconButton
                  size="small"
                  onClick={() => setExpandParameter(!expandParameter)}
                  aria-label="start"
                >
                  {getExpandElement()}
                </IconButton>
              </Typography>
            </Grid>
          </Grid>
          <Box
            border={1}
            borderColor="lightgrey"
            bgcolor="whitesmoke"
            borderRadius="borderRadius"
          >
            <Box p={2}>
              <ReactJson src={request.parameters} />
            </Box>
          </Box>
        </Box>
      );
    }
  }

  function renderComponents() {
    if (request) {
      return (
        <div>
          <Breadcrumbs
            breadcrumbs={[
              request.namespace,
              request.system,
              request.system_version,
              request.command,
              "",
            ]}
          />
          <RequestsTable parentState={state} />
          <Box pt={4} display="flex" alignItems="flex-start">
            {outputBox(request)}
            {parameterBox(request)}
          </Box>
        </div>
      );
    } else {
      return (
        <Backdrop open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      );
    }
  }

  function getButton() {
    if (request) {
      return (
        <Button
          component={RouterLink}
          to={{
            pathname: [
              "/systems",
              request.namespace,
              request.system,
              request.system_version,
              "commands",
              request.command,
            ].join("/"),
            state: { request: request },
          }}
          variant="contained"
          color="primary"
        >
          Pour it Again
        </Button>
      );
    }
  }

  if (request) {
    if (request.output_type === "STRING") {
      filename = id + ".txt";
    } else if (request.output_type === "HTML") {
      filename = id + ".html";
    } else if (request.output_type === "JSON") {
      filename = id + ".json";
    }
    state.completeDataSet = [request];
  } else {
    requestService.getRequest(successCallback, id);
  }

  return (
    <Box>
      <Grid justify="space-between" container>
        <Grid item>
          <PageHeader title={title} description={id} />
        </Grid>
        <Grid item>
          <Typography style={{ flex: 1 }}>{getButton()}</Typography>
        </Grid>
      </Grid>
      <Divider />
      {renderComponents()}
    </Box>
  );
};

export default RequestViewApp;
