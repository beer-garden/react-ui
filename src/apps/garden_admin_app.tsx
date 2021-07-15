import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";

import GardensService from "../services/garden_service";
import PageHeader from "../components/page_header";
import GardenCard from "../components/garden_admin_card";
import Divider from "../components/divider";

class SystemsAdminApp extends Component {
  state = {
    gardens: [],
  };
  title = "Gardens Management";

  componentDidMount() {
    GardensService.getGardens(this);
  }

  successCallback(response: any) {
    this.setState({ gardens: response.data });
  }

  render() {
    return (
      <div>
        <PageHeader title={this.title} description={""} />
        <Divider />
        <Grid container spacing={3}>
          {this.state.gardens.map((garden) => (
            <Grid key={garden["name"]} item xs={4}>
              <GardenCard garden={garden} />
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }
}

export default SystemsAdminApp;
