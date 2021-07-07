import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { Link as RouterLink } from "react-router-dom";

import Table from "../components/table";
import PageHeader from "../components/page_header";
import Divider from "../components/divider";

type MyProps = {
  systems: any;
};
type MyState = {
  data: any[];
  page: number;
  rowsPerPage: number;
  totalItems: number | null;
  search: string;
  tableKeys: string[];
  tableHeads: string[];
};

class SystemsApp extends Component<MyProps, MyState> {
  systems: object[] = this.props.systems;
  state: MyState = {
    data: [],
    page: 0,
    rowsPerPage: 5,
    totalItems: null,
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
    let state = this.state;
    let newData = this.systems.slice(
      state.page * state.rowsPerPage,
      state.page * state.rowsPerPage + state.rowsPerPage
    );
    newData = this.formatData(newData);
    this.setState({ data: newData, totalItems: this.systems.length });
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
          tempData[i][this.state.tableKeys[tableKey]] = this.exploreButton(
            data[i]
          );
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

  exploreButton(system: any) {
    return (
      <Button
        component={RouterLink}
        to={["/systems", system.namespace, system.name, system.version].join(
          "/"
        )}
        variant="contained"
        color="primary"
      >
        Explore
      </Button>
    );
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
