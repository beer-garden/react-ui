import React, { Component } from "react";
import ReactJson from 'react-json-view';
import Box from '@material-ui/core/Box';

import jobService from '../services/job_service';
//import PageHeader from '../components/page_header';
import JobViewForm from '../components/job_create_form';
    class JobCreateApp  extends Component {
      JobService = jobService;
	  state = {
	    schema: {},
	    uischema: {},
	    initialModel: {},
	    redirect: null,
	    data: {},
	    errors: [],
      }
      title = "";
      description = "";
      breadcrumbs = [];

	  componentDidMount() {
//	      const { namespace, system_name, version, command_name } = this.props.match.params;
	      this.schema = this.JobService.SCHEMA;
          this.uischema = this.JobService.UISCHEMA;
          this.initialModel = this.JobService.MODEL;
          if (this.props.location.state){
            const { request } = this.props.location.state;
            this.request = request;
          }

          this.setState({data: this.initialModel});
      }

      getForm(){
        if(this.schema){
            return(<JobViewForm self={this} schema={this.schema} uischema={this.uischema} initialModel={this.initialModel} />)
        }
      }
      render() {
        return (

        <Box>
          {this.state.redirect}
            <Box
                display="flex"
                alignItems="flex-start"
              >
                <Box width={3/4}>
                    {this.getForm()}
                </Box>
                <Box pl={1} width={1/4} style={{ verticalAlign: 'top' }} >
                    <h3>Preview</h3>
                    <ReactJson src={this.state.data} />
                </Box>
            </Box>
        </Box>
        )
      }
    }

    export default JobCreateApp;
