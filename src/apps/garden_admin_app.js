
    import React, { Component } from 'react';
    import Grid from '@material-ui/core/Grid';

	import GardensService from '../services/garden_service';
	import PageHeader from '../components/page_header';
	import GardenCard from '../components/garden_admin_card';
	import Divider from '../components/divider';

    class SystemsAdminApp extends Component {
//      systems = this.props.systems;
//      gardens = this.props.gardens;
	  state = {
        gardens: []
      }

      formatSystems(){
        let system_names = [];
        for(let i in this.systems){
          if(!system_names.includes(this.systems[i].name)){
              system_names.push(this.systems[i].name);
          }
        }
        system_names.sort()
        let sortedSystems = [];
//        for(let i in system_names){
//          sortedSystems[i] = SystemsService.filterSystems(this.systems, {name: system_names[i]});
//        }
        this.setState({data: sortedSystems})
      }

      title = "Gardens Management";
      breadcrumbs = null;

	  componentDidMount() {
        GardensService.getGardens(this);
      }

      successCallback(response){
        this.setState({gardens: response.data})
      }

      render() {
        return (
        <div>
          <PageHeader title = {this.title} breadcrumbs = {this.breadcrumbs} />
          <Divider />
          <Grid container spacing={3} >
              {(this.state.gardens).map((garden) => (
                  <Grid key={garden.name} item xs={4} >
                    <GardenCard garden = {garden} />
                  </Grid>
              ))}
          </Grid>

        </div>
        )
      }
    }

    export default SystemsAdminApp;