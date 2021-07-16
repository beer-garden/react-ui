import React, { Component } from "react";
import ReactJson from "react-json-view";
import Box from "@material-ui/core/Box";
import { Redirect } from "react-router";
import { match as Match, RouteComponentProps } from "react-router-dom";

import { sfBuilderService } from "../builderForm/service";
import Divider from "../components/divider";
import Breadcrumbs from "../components/breadcrumbs";
import PageHeader from "../components/page_header";
import CommandViewForm from "../components/command_view_form";
import SystemsService from "../services/system_service";
import { CommandParams, System } from "../custom_types/custom_types";

interface MyProps extends RouteComponentProps<CommandParams> {
  systems: System[];
  match: Match<CommandParams>;
  location: any;
}
type MyState = {
  redirect: any;
  data: any;
  model: any;
  errors: any;
};

class CommandViewApp extends Component<MyProps, MyState> {
  systems: System[] = this.props.systems;
  initialData: any = {};
  command: any = {};
  schema: any = null;
  namespace = "";
  system_name = "";
  version = "";
  command_name = "";
  uischema: any = {};
  state: MyState = {
    redirect: null,
    data: undefined,
    model: {},
    errors: [],
  };
  title = "";
  description = "";
  breadcrumbs: any[] = [];
  initialSchema: any = {};

  componentDidMount() {
    const { command_name, namespace, system_name, version } =
      this.props.match.params;
    this.namespace = namespace || "";
    this.system_name = system_name || "";
    this.version = version || "";
    this.command_name = command_name || "";
    this.title = command_name || "";
    this.breadcrumbs = [
      this.namespace,
      this.system_name,
      this.version,
      this.command_name,
    ];

    const system = SystemsService.getSystem(
      this.systems,
      this.namespace,
      this.system_name,
      this.version
    );
    if (system) {
      this.command = SystemsService.getCommand(
        system.commands,
        this.command_name
      );
    }
    const SFBuilderService: any = sfBuilderService();
    const build = SFBuilderService.build(system, this.command);
    this.initialSchema = build.schema;
    this.uischema = build.form;
    this.initialData = build.model;
    let requestData = null;
    let pourItAgainRequest: any = window.localStorage.getItem(
      `lastKnown_pour_it_again_request`
    );
    pourItAgainRequest = JSON.parse(pourItAgainRequest);
    if (pourItAgainRequest) {
      requestData = this.formatRequestToData(
        pourItAgainRequest.request,
        this.initialData
      );
      console.log(pourItAgainRequest);
      window.localStorage.setItem(
        `lastKnown_pour_it_again_request`,
        JSON.stringify(false)
      );
    }
    this.description = this.command["description"];
    this.schema = this.formatSchema(build.model, build.schema);
    this.setState({
      data: requestData || this.initialData,
      model: this.formatDataToModel(requestData || this.initialData),
    });
  }

  successCallback(response: any) {
    this.setState({
      redirect: <Redirect push to={"/requests/".concat(response.data.id)} />,
    });
  }

  formatDataToModel(data: any) {
    const model: any = {};
    for (const key in data) {
      if (key === "parameters") {
        if (!model[key]) {
          model[key] = {};
        }
        for (const parameters_key in data[key]) {
          if (parameters_key.endsWith("__dict")) {
            model[key][parameters_key.replace("__dict", "")] =
              data[key][parameters_key];
          } else {
            model[key][parameters_key] = data[key][parameters_key];
          }
        }
      } else {
        model[key] = data[key];
      }
    }
    return model;
  }

  formatRequestToData(request: any, data: any) {
    const tempData: any = {};
    for (const key in data) {
      tempData[key] = {};
      if (key === "parameters") {
        for (const parameters_key in data[key]) {
          if (parameters_key.endsWith("__dict")) {
            tempData[key][parameters_key] =
              request[key][parameters_key.replace("__dict", "")];
          } else {
            tempData[key][parameters_key] = request[key][parameters_key];
          }
        }
      } else {
        tempData[key] = request[key];
      }
    }
    if (request["comment"]) {
      tempData["comment"] = request["comment"];
    }
    return tempData;
  }

  formatSchema(data: any, schema: any) {
    for (const i in this.command.parameters) {
      const parameter = this.command.parameters[i];
      if (parameter.choices) {
        const key =
          data[parameter.choices.details.key_reference] ||
          data.parameters[parameter.choices.details.key_reference];
        if (parameter.choices.value.constructor === Object) {
          const value = parameter.choices.value[key] || [""];
          schema.properties.parameters.properties[parameter.key]["enum"] =
            Array.from(new Set(value));
        }
      }
    }
    return schema;
  }

  getForm() {
    if (this.schema) {
      return (
        <CommandViewForm
          self={this}
          schema={this.schema}
          uischema={this.uischema}
          initialData={this.initialData}
        />
      );
    }
  }

  render() {
    if (this["command"] && this.state.data) {
      this.schema = this.formatSchema(this.state.model, this.initialSchema);
    }
    return (
      <Box>
        {this.state.redirect}
        <PageHeader title={this.title} description={this.description} />
        <Divider />
        <Breadcrumbs breadcrumbs={this.breadcrumbs} />
        <Box pt={2} display="flex" alignItems="flex-start">
          <Box width={3 / 4}>{this.getForm()}</Box>
          <Box pl={1} width={1 / 4} style={{ verticalAlign: "top" }}>
            <h3>Preview</h3>
            <ReactJson src={this.state.model} />
          </Box>
        </Box>
        <Box pt={2} display="flex" alignItems="flex-start">
          <Box width={1 / 3}>
            <h3>Command</h3>
            <ReactJson src={this.command} />
          </Box>
          <Box width={1 / 3}>
            <h3>Schema</h3>
            <ReactJson src={this.schema} />
          </Box>
          <Box width={1 / 3}>
            <h3>UI Schema</h3>
            <ReactJson src={this.uischema} />
          </Box>
        </Box>
      </Box>
    );
  }
}

export default CommandViewApp;
