import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import SystemsService from "../services/system_service";
import AdminService from "../services/admin_service";
import PageHeader from "../components/page_header";
import SystemCard from "../components/system_admin_card";
import Divider from "../components/divider";
import { System } from "../custom_types/custom_types";

type MyProps = {
  systems: System[];
};
type MyState = {
  data: System[][];
};

class SystemsAdminApp extends Component<MyProps, MyState> {
  systems = this.props.systems;
  state: MyState = {
    data: [],
  };
  title = "Systems Management";

  formatSystems(): void {
    const system_names: string[] = [];
    for (const i in this.systems) {
      if (!system_names.includes(this.systems[i].name)) {
        system_names.push(this.systems[i].name);
      }
    }
    system_names.sort();
    const sortedSystems: System[][] = [];
    for (const i in system_names) {
      sortedSystems[i] = SystemsService.filterSystems(this.systems, {
        name: system_names[i],
        namespace: "",
        version: "",
      });
    }
    this.setState({ data: sortedSystems });
  }

  componentDidMount(): void {
    this.formatSystems();
  }

  render(): JSX.Element {
    return (
      <div>
        <Grid justify="space-between" container>
          <Grid item>
            <PageHeader title={this.title} description={""} />
          </Grid>
          <Grid item>
            <Typography style={{ flex: 1 }}>
              <Button variant="contained" color="secondary">
                Clear All Queues
              </Button>
              <Button
                onClick={() => AdminService.rescan()}
                variant="contained"
                color="primary"
              >
                Rescan Plugin Directory
              </Button>
            </Typography>
          </Grid>
        </Grid>
        <Divider />
        <Grid container spacing={3}>
          {this.state.data.map((systems, index) => (
            <Grid item xs={4} key={"systems" + index}>
              <SystemCard systems={systems} />
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }
}

export default SystemsAdminApp;
