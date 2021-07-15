import React, { Component } from "react";
import ReactJson from "react-json-view";
import Box from "@material-ui/core/Box";

import jobService from "../services/job_service";
import JobViewForm from "../components/job_create_form";

type MyProps = {
  location: any;
};
type MyState = {
  redirect: any;
  data: any;
  errors: any[];
};

class JobCreateApp extends Component<MyProps, MyState> {
  JobService = jobService;
  schema = this.JobService.SCHEMA;
  uischema = this.JobService.UISCHEMA;
  initialModel = this.JobService.MODEL;
  state: MyState = {
    redirect: null,
    data: {},
    errors: [],
  };

  title = "";
  description = "";
  request: any;

  componentDidMount() {
    if (this.props.location.state) {
      const { request } = this.props.location.state;
      this.request = request;
    }
    this.setState({ data: this.initialModel });
  }

  getForm() {
    if (this.schema) {
      return (
        <JobViewForm
          self={this}
          schema={this.schema}
          uischema={this.uischema}
          initialModel={this.initialModel}
        />
      );
    }
  }

  render() {
    return (
      <Box>
        {this.state.redirect}
        <Box display="flex" alignItems="flex-start">
          <Box width={3 / 4}>{this.getForm()}</Box>
          <Box pl={1} width={1 / 4} style={{ verticalAlign: "top" }}>
            <h3>Preview</h3>
            <ReactJson src={this.state.data} />
          </Box>
        </Box>
      </Box>
    );
  }
}

export default JobCreateApp;
