import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { Link as RouterLink } from "react-router-dom";

import PageHeader from "../components/page_header";
import Divider from "../components/divider";
import Breadcrumbs from "../components/breadcrumbs";
import SystemsService from "../services/system_service";
import Table from "../components/table";
import System from "../custom_types/system_type";
import Command from "../custom_types/command_type";
import CacheService from "../services/cache_service";
import TableService from "../services/table_service";
import MyState from "../custom_types/table_state_type";

type MyProps = {
  systems: System[];
  match: any;
};

type CachedStateType = {
  rowsPerPage: number;
};

class CommandsApp extends Component<MyProps, MyState> {
  cachedState: CachedStateType = CacheService.getIndexLastState(
    `lastKnownStateCommandIndex`
  );

  systems: System[] = this.props.systems;
  commands: Command[] = [];
  namespace = null;
  systemName = null;
  systemVersion = null;
  state: MyState = {
    data: [],
    page: 0,
    rowsPerPage: this.cachedState.rowsPerPage,
    totalItems: null,
    totalItemsFiltered: 0,
    search: "",
    tableKeys: [
      "namespace",
      "systemName",
      "systemVersion",
      "name",
      "description",
      "",
    ],
    tableHeads: [
      "Namespace",
      "System",
      "Version",
      "Command",
      "Description",
      "",
    ],
  };
  title = "Commands";
  breadcrumbs: any = null;

  updateData() {
    TableService.updateData(
      this,
      this.commands,
      this.commands.length,
      `lastKnownStateCommandIndex`
    );
  }

  componentDidMount() {
    const { namespace, system_name, version } = this.props.match.params;
    this.namespace = namespace;
    this.systemName = system_name;
    this.systemVersion = version;
    let systems = SystemsService.filterSystems(this.systems, {
      namespace: namespace,
      name: system_name,
      version: version,
    });
    for (let i in systems) {
      if (systems.hasOwnProperty(i)) {
        for (let k in systems[i].commands) {
          if (systems[i].commands.hasOwnProperty(k)) {
            systems[i].commands[k]["namespace"] = systems[i].namespace;
            systems[i].commands[k]["systemName"] = systems[i].name;
            systems[i].commands[k]["systemVersion"] = systems[i].version;
          }
        }
        this.commands = this.commands.concat(systems[i].commands);
      }
    }
    this.breadcrumbs = [namespace, system_name, version].filter(function (x) {
      return x !== undefined;
    });
    this.updateData();
  }

  formatData(data: any[]) {
    let tempData: any[] = [];
    for (let i in data) {
      for (let tableKey in this.state.tableKeys) {
        if (!tempData[i]) {
          tempData[i] = {};
        }
        if (this.state.tableKeys[tableKey] === "") {
          tempData[i][this.state.tableKeys[tableKey]] = this.makeItHappenButton(
            data[i]
          );
        } else if (this.state.tableKeys[tableKey] === "description") {
          tempData[i][this.state.tableKeys[tableKey]] =
            data[i][this.state.tableKeys[tableKey]] ||
            "No Description Provided";
        } else {
          tempData[i][this.state.tableKeys[tableKey]] =
            data[i][this.state.tableKeys[tableKey]];
        }
      }
    }
    return tempData;
  }

  makeItHappenButton(command: any) {
    return (
      <Button
        component={RouterLink}
        to={[
          "/systems",
          command.namespace,
          command.systemName,
          command.systemVersion,
          "commands",
          command.name,
        ].join("/")}
        variant="contained"
        color="primary"
      >
        Make it Happen
      </Button>
    );
  }

  render() {
    return (
      <Box>
        <PageHeader title={this.title} description={""} />
        <Divider />
        <Breadcrumbs breadcrumbs={this.breadcrumbs} />
        <Table self={this} disableSearch={false} includePageNav={true} />
      </Box>
    );
  }
}

export default CommandsApp;
