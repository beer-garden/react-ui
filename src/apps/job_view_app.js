
    import React, { Component } from 'react';
    import Box from '@material-ui/core/Box';
    import { Link as RouterLink } from 'react-router-dom';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
//import { red, blue } from 'material-ui/colors'
//import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
    import ReactJson from 'react-json-view';

	import JobService from '../services/job_service';
	import PageHeader from '../components/page_header';
	import Table from '../components/table';

    class JobViewApp extends Component {
      job = {};
	  state = {
        data: [],
        tableKeys: ['name', 'request_template__system', 'request_template__system_version', 'request_template__instance_name', 'request_template__command', 'status', 'success_count', 'error_count', 'next_run_time'],
        tableHeads: ['Job Name', 'System', 'System Version', 'Instance Name', 'Command', 'Status', 'Success Count', 'Error Count', 'Next Run Time']
      }
      title = "Job";
      breadcrumbs = null;
	  componentDidMount() {
	      const { id } = this.props.match.params
            this.id = id;
            JobService.getJob(this,id);
      }

      formatData(self, data){
        let tempData = [];
        for(let i in data){
            for(let tableKey in self.state.tableKeys){
                if(!tempData[i]){
                    tempData[i] = {};
                }
                if(self.state.tableKeys[tableKey] === "next_run_time"){
                    tempData[i][self.state.tableKeys[tableKey]] = (new Date(data[i][self.state.tableKeys[tableKey]])).toString();
                } else if(self.state.tableKeys[tableKey].includes("__")){
                    let keys = self.state.tableKeys[tableKey].split("__");
                    if (keys[1] === "system_version"){
                        tempData[i][self.state.tableKeys[tableKey]] = (
                            <RouterLink to={['/systems',data[i].request_template.namespace, data[i].request_template.system, data[i].request_template.system_version].join('/')}>
                                {data[i][keys[0]][keys[1]]}
                            </RouterLink>
                        )
                    } else {
                        tempData[i][self.state.tableKeys[tableKey]] = data[i][keys[0]][keys[1]];
                    }
                } else {
                    tempData[i][self.state.tableKeys[tableKey]] = data[i][self.state.tableKeys[tableKey]];
                }
            }
        }
        return tempData;
      }

      successCallback(response){
        this.description = [response.data.name, this.id].join(' - ');
        this.job = response.data;
        this.setState({ data: this.formatData(this, [response.data]) });
      }

      renderComponents(){
        if (this.state.data[0]){
            return(
                <div>
                    <Table self = {this} updateData = {this.updateData} disableSearch = {true} />
                    <Box p={2}
                        display="flex"
                        alignItems="flex-start"
                    >
                        <Box width={1/2} >
                            <h3>Trigger</h3>
                            <Box border={1}>
                                <ReactJson src={this.job.trigger} />
                            </Box>
                        </Box>
                        <Box pl={1} width={1/2}  >
                            <h3>Request Template</h3>
                            <Box border={1}>
                                <ReactJson src={this.job.request_template} />
                            </Box>
                        </Box>
                    </Box>
                </div>
            )
        } else {
            return (
                <Backdrop open={true} >
                  <CircularProgress color="inherit" />
                </Backdrop>
            )
        }
      }
      getButton(){
        if(this.job.status === 'RUNNING'){
            return(
                    <Button variant="contained" style={{backgroundColor: '#e38d13', color: 'white'}} onClick={() => {JobService.pauseJob(this, this.id)}}>Pause job</Button>

            )
        } else if(this.job.status === 'PAUSED'){
            return(<Button variant="contained" style={{backgroundColor: 'green', color: 'white'}} onClick={() => {JobService.resumeJob(this, this.id)}}>Resume job</Button>)
        }
      }

      render() {
        return (
        <Box>
          <Grid
                justify="space-between" // Add it here :)
                container
          >
            <Grid item>
                <PageHeader title = {this.title} description = {this.id} breadcrumbs = {this.breadcrumbs} />
            </Grid>
            <Grid item>
                <Typography style={{ flex: 1 }}>
                    <Button variant="contained" color="secondary" onClick={() => {JobService.deleteJob(this, this.id)}}>Delete Job</Button>
                    {this.getButton()}
                    <Button variant="contained" color="primary">Update Job</Button>
                </Typography>
            </Grid>
          </Grid>
          {this.renderComponents()}
        </Box>
        )
      }
    }

    export default JobViewApp;