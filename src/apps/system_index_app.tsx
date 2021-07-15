import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { Link as RouterLink } from "react-router-dom";

import Table from "../components/table";
import PageHeader from "../components/page_header";
import Divider from "../components/divider";
import System from "../custom_types/system_type";
import CacheService from "../services/cache_service";
import TableService from "../services/table_service";
import MyState from "../custom_types/table_state_type";

type MyProps = {
  systems: System[];
};

type CachedStateType = {
  rowsPerPage: number;
};

function exploreButton(system: any) {
  return (
    <Button
      size="small"
      component={RouterLink}
      to={["/systems", system.namespace, system.name, system.version].join("/")}
      variant="contained"
      color="primary"
    >
      Explore
    </Button>
  );
}

class SystemsApp extends Component<MyProps, MyState> {
  cachedState: CachedStateType = CacheService.getIndexLastState(
    `lastKnownState_${window.location.href}`
  );
  state: MyState = {
    data: [],
    page: 0,
    rowsPerPage: this.cachedState.rowsPerPage,
    totalItems: this.props.systems.length,
    totalItemsFiltered: 0,
    search: "",
    tableKeys: [
      "namespace",
      "name",
      "version",
      "description",
      "commands",
      "instances",
      "",
    ],
    tableHeads: [
      "Namespace",
      "System",
      "Version",
      "Description",
      "Commands",
      "Instances",
      "",
    ],
  };
  title = "Systems";

  updateData() {
    TableService.updateData(
      this,
      this.props.systems,
      this.props.systems.length,
      `lastKnownState_${window.location.href}`
    );
  }

  formatData(data: any[]) {
    let tempData: any[] = [];
    for (let i in data) {
      for (let tableKey in this.state.tableKeys) {
        if (!tempData[i]) {
          tempData[i] = {};
        }
        if (
          this.state.tableKeys[tableKey] === "commands" ||
          this.state.tableKeys[tableKey] === "instances"
        ) {
          tempData[i][this.state.tableKeys[tableKey]] =
            data[i][this.state.tableKeys[tableKey]].length;
        } else if (this.state.tableKeys[tableKey] === "") {
          tempData[i][this.state.tableKeys[tableKey]] = exploreButton(data[i]);
        } else {
          tempData[i][this.state.tableKeys[tableKey]] =
            data[i][this.state.tableKeys[tableKey]];
        }
      }
    }
    return tempData;
  }

  componentDidMount() {
    this.updateData();
  }

  render() {
    return (
      <div>
        <PageHeader title={this.title} description={""} />
        <Divider />
        <Table self={this} disableSearch={false} includePageNav={true} />
      </div>
    );
  }
}

export default SystemsApp;
