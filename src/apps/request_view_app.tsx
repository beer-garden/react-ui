import React, { Component } from "react";
import Box from "@material-ui/core/Box";
import ReactJson from "react-json-view";
import { Link as RouterLink } from "react-router-dom";
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

type MyProps = {
  match: any;
};
type MyState = {
  parameterOutputWidth: number;
  expandOutput: boolean;
  expandParameter: boolean;
  data: any[];
  tableKeys: string[];
  tableHeads: string[];
};

class RequestViewApp extends Component<MyProps, MyState> {
  filename: string = "";
  state: MyState = {
    parameterOutputWidth: 1,
    expandOutput: false,
    expandParameter: false,
    data: [],
    tableKeys: [
      "command",
      "system",
      "system_version",
      "instance_name",
      "status",
      "created_at",
      "updated_at",
      "comment",
    ],
    tableHeads: [
      "Command",
      "System",
      "System Version",
      "Instance Name",
      "Status",
      "Created",
      "Updated",
      "Comment",
    ],
  };
  title = "Request View";
  id: string = "";
  request: any;

  componentDidMount() {
    const { id } = this.props.match.params;
    this.id = id;
    RequestService.getRequest(this, id);
  }

  formatData(data: any[]) {
    let tempData: any[] = [];
    for (let i in data) {
      for (let tableKey in this.state.tableKeys) {
        if (!tempData[i]) {
          tempData[i] = {};
        }
        if (this.state.tableKeys[tableKey] === "system_version") {
          tempData[i][this.state.tableKeys[tableKey]] = (
            <RouterLink
              to={[
                "/systems",
                data[i].namespace,
                data[i].system,
                data[i].system_version,
              ].join("/")}
            >
              {data[i][this.state.tableKeys[tableKey]]}
            </RouterLink>
          );
        } else if (this.state.tableKeys[tableKey].includes("_at")) {
          tempData[i][this.state.tableKeys[tableKey]] = new Date(
            data[i][this.state.tableKeys[tableKey]]
          ).toString();
        } else {
          tempData[i][this.state.tableKeys[tableKey]] =
            data[i][this.state.tableKeys[tableKey]];
        }
      }
    }
    return tempData;
  }

  successCallback(response: any) {
    this.request = response.data;
    if (this.request.output_type == "STRING") {
      this.filename = this.id + ".txt";
    } else if (this.request.output_type == "HTML") {
      this.filename = this.id + ".html";
    } else if (this.request.output_type == "JSON") {
      this.filename = this.id + ".json";
    }
    let data = this.formatData([this.request]);
    this.setState({ data: data });
  }

  outputFormatted() {
    if (["SUCCESS", "CANCELED", "ERROR"].includes(this.request.status)) {
      let output = this.request.output;
      let output_type = this.request.output_type;
      if (output_type === "STRING") {
        return <span>{output}</span>;
      } else if (output_type === "JSON") {
        output = JSON.parse(output);
        return <ReactJson src={output} />;
      } else if (output_type === "HTML") {
        return <div dangerouslySetInnerHTML={{ __html: output }} />;
      }
    } else {
      return <CircularProgress color="inherit" />;
    }
  }

  getExpandElement() {
    if (this.state.expandParameter || this.state.expandOutput) {
      return <ExpandLessIcon />;
    } else {
      return <ExpandMoreIcon />;
    }
  }

  outputBox() {
    if (!this.state.expandParameter) {
      return (
        <Box width={this.state.parameterOutputWidth}>
          <Grid justify="space-between" container>
            <Grid item>
              <Typography variant="h6">Outputs</Typography>
            </Grid>
            <Grid item>
              <Typography style={{ flex: 1 }}>
                <IconButton
                  size="small"
                  onClick={() =>
                    this.setState({ expandOutput: !this.state.expandOutput })
                  }
                  aria-label="expand"
                >
                  {this.getExpandElement()}
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
            <Box p={2}>{this.outputFormatted()}</Box>
          </Box>
        </Box>
      );
    }
  }

  parameterBox() {
    if (!this.state.expandOutput) {
      return (
        <Box
          pl={1}
          width={this.state.parameterOutputWidth}
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
                  onClick={() =>
                    this.setState({
                      expandParameter: !this.state.expandParameter,
                    })
                  }
                  aria-label="start"
                >
                  {this.getExpandElement()}
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
              <ReactJson src={this.request.parameters} />
            </Box>
          </Box>
        </Box>
      );
    }
  }

  renderComponents() {
    if (this.state.data[0]) {
      return (
        <div>
          <RequestsTable
            self={this}
            includePageNav={false}
            disableSearch={true}
          />
          <Box pt={4} display="flex" alignItems="flex-start">
            {this.outputBox()}
            {this.parameterBox()}
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

  getButton() {
    if (this.request) {
      return (
        <Button
          component={RouterLink}
          to={{
            pathname: [
              "/systems",
              this.request.namespace,
              this.request.system,
              this.request.system_version,
              "commands",
              this.request.command,
            ].join("/"),
            state: { request: this.request },
          }}
          variant="contained"
          color="primary"
        >
          Pour it Again
        </Button>
      );
    }
  }

  render() {
    return (
      <Box>
        <Grid justify="space-between" container>
          <Grid item>
            <PageHeader title={this.title} description={this.id} />
          </Grid>
          <Grid item>
            <Typography style={{ flex: 1 }}>{this.getButton()}</Typography>
          </Grid>
        </Grid>
        <Divider />
        {this.renderComponents()}
      </Box>
    );
  }
}

export default RequestViewApp;
