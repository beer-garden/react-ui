import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";

import RequestsTable from "../components/table";
import PageHeader from "../components/page_header";
import JobsService from "../services/job_service";
import Divider from "../components/divider";
import CacheService from "../services/cache_service";
import TableService from "../services/table_service";
import MyState from "../custom_types/table_state_type";

type CachedStateType = {
  rowsPerPage: number;
};

class JobsApp extends Component {
  cachedState: CachedStateType = CacheService.getIndexLastState(
    `lastKnownState_${window.location.href}`
  );
  state: MyState = {
    page: 0,
    data: [],
    search: "",
    totalItems: 0,
    totalItemsFiltered: 0,
    rowsPerPage: this.cachedState.rowsPerPage,
    tableKeys: [
      "name",
      "status",
      "request_template__system",
      "request_template__instance_name",
      "request_template__command",
      "next_run_time",
      "success_count",
      "error_count",
    ],
    tableHeads: [
      "Job Name",
      "Status",
      "System",
      "Instance",
      "Command",
      "Next Run Time",
      "Success Count",
      "Error Count",
    ],
  };
  title = "Request Scheduler";
  jobs: any;

  updateData() {
    TableService.updateData(
      this,
      this.jobs,
      this.jobs.length,
      `lastKnownState_${window.location.href}`
    );
  }

  componentDidMount() {
    JobsService.dataFetch(this);
  }

  formatData(data: any[]) {
    let tempData: any[] = [];
    for (let i in data) {
      for (let tableKey in this.state.tableKeys) {
        if (!tempData[i]) {
          tempData[i] = {};
        }
        if (this.state.tableKeys[tableKey] === "name") {
          tempData[i][this.state.tableKeys[tableKey]] = (
            <RouterLink to={"/jobs/" + data[i].id}>
              {data[i][this.state.tableKeys[tableKey]]}
            </RouterLink>
          );
        } else if (this.state.tableKeys[tableKey] === "next_run_time") {
          tempData[i][this.state.tableKeys[tableKey]] = new Date(
            data[i][this.state.tableKeys[tableKey]]
          ).toString();
        } else if (this.state.tableKeys[tableKey].includes("__")) {
          let keys = this.state.tableKeys[tableKey].split("__");
          tempData[i][this.state.tableKeys[tableKey]] =
            data[i][keys[0]][keys[1]];
        } else {
          tempData[i][this.state.tableKeys[tableKey]] =
            data[i][this.state.tableKeys[tableKey]];
        }
      }
    }
    return tempData;
  }

  successCallback(response: any) {
    this.jobs = response.data;
    this.updateData();
  }

  render() {
    return (
      <div>
        <PageHeader title={this.title} description={""} />
        <Divider />
        <RequestsTable self={this} includePageNav={true} disableSearch={true} />
      </div>
    );
  }
}

export default JobsApp;
