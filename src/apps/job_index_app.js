
    import React, { Component } from 'react';
    import { Link as RouterLink } from 'react-router-dom';

	import RequestsTable from '../components/table';
	import PageHeader from '../components/page_header';
	import JobsService from '../services/job_service';
	import Divider from '../components/divider';

    class JobsApp extends Component {

	  state = {
        jobs: {},
        page: 0,
        data: [],
        totalItems: 0,
        rowsPerPage: 5,
        tableKeys: ['name', 'status', 'request_template__system', 'request_template__instance_name', 'request_template__command', 'next_run_time', 'success_count', 'error_count'],
        tableHeads: ['Job Name', 'Status', 'System', 'Instance', 'Command', 'Next Run Time', 'Success Count', 'Error Count']
      }

      updateData(self){
          let state = self.state;
          let newData = self.jobs.slice(state.page*state.rowsPerPage, (state.page*state.rowsPerPage+state.rowsPerPage));
          newData = self.formatData(self, newData)
          self.setState({data: newData, totalItems: self.jobs.length})
      }
      title = "Request Scheduler";
      breadcrumbs = null;
	  componentDidMount() {
          JobsService.dataFetch(this);
      }

      formatData(self, data){
          let tempData = [];
          for(let i in data){
              for(let tableKey in self.state.tableKeys){
                  if(!tempData[i]){
                      tempData[i] = {};
                  }
                  if(self.state.tableKeys[tableKey] === "name"){
                      tempData[i][self.state.tableKeys[tableKey]] = (
                          <RouterLink to={'/jobs/'+data[i].id}>
                              {data[i][self.state.tableKeys[tableKey]]}
                          </RouterLink>
                      );
                  } else if(self.state.tableKeys[tableKey] === "next_run_time"){
                      tempData[i][self.state.tableKeys[tableKey]] = (new Date(data[i][self.state.tableKeys[tableKey]])).toString();
                  } else if(self.state.tableKeys[tableKey].includes("__")){
                      let keys = self.state.tableKeys[tableKey].split("__");
                      tempData[i][self.state.tableKeys[tableKey]] = data[i][keys[0]][keys[1]];
                  } else {
                      tempData[i][self.state.tableKeys[tableKey]] = data[i][self.state.tableKeys[tableKey]];
                  }
              }
          }
          return tempData;
        }

      successCallback(response){
        this.jobs = response.data;
        this.updateData(this)
      }

      render() {
        return (
        <div>
          <PageHeader title = {this.title} breadcrumbs = {this.breadcrumbs} />
          <Divider />
          <RequestsTable self = {this} updateData = {this.updateData} includePageNav = {true} disableSearch = {true} />
        </div>
        )
      }
    }

    export default JobsApp;