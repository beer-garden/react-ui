
    import React, { Component } from 'react';
	import Button from '@material-ui/core/Button';
	import Box from '@material-ui/core/Box';
    import { Link as RouterLink } from 'react-router-dom';

	import PageHeader from '../components/page_header';
	import Divider from '../components/divider';
	import Breadcrumbs from '../components/breadcrumbs';
	import SystemsService from '../services/system_service';
	import Table from '../components/table';


    class CommandsApp extends Component {
      systems = this.props.systems;
      commands = [];
	  state = {
        data: [],
        page: 0,
        rowsPerPage: 5,
        totalItems: null,
        search: "",
        tableKeys: ['namespace', 'systemName', 'systemVersion', 'name', 'description', ''],
        tableHeads: ['Namespace', 'System', 'Version', 'Command', 'Description', '']
      }

      updateData(self){
          let state = self.state;
          let newData = self.commands.slice(state.page*state.rowsPerPage, (state.page*state.rowsPerPage+state.rowsPerPage));
          newData = self.formatData(self, newData)
          self.setState({data: newData, totalItems: self.commands.length})
      }
      title = "Commands";
      breadcrumbs = null;
	  componentDidMount() {
	      const { namespace, system_name, version } = this.props.match.params;
          this.namespace = namespace;
          this.systemName = system_name;
          this.systemVersion = version;
	      let systems = SystemsService.filterSystems(this.systems,{ namespace: namespace, name: system_name, version: version });
	      for(let i in systems){
	        for (let k in systems[i].commands){
	            systems[i].commands[k]['namespace'] = systems[i].namespace;
	            systems[i].commands[k]['systemName'] = systems[i].name;
	            systems[i].commands[k]['systemVersion'] = systems[i].version;
	        }
	        this.commands = this.commands.concat(systems[i].commands)
	      }
	      this.breadcrumbs = [namespace, system_name, version].filter(function(x) { return x !== undefined; });
	      this.updateData(this);
      }

      formatData(self, data){
          let tempData = [];
          for(let i in data){
              for(let tableKey in self.state.tableKeys){
                  if(!tempData[i]){
                      tempData[i] = {};
                  }
                  if(self.state.tableKeys[tableKey] === ""){
                      tempData[i][self.state.tableKeys[tableKey]] = self.makeItHappenButton(self, data[i]);
                  } else if(self.state.tableKeys[tableKey] === "description") {
                      tempData[i][self.state.tableKeys[tableKey]] = data[i][self.state.tableKeys[tableKey]] || "No Description Provided";
                  } else {
                      tempData[i][self.state.tableKeys[tableKey]] = data[i][self.state.tableKeys[tableKey]];
                  }
              }
          }
          return tempData;
      }

      makeItHappenButton(self, command){
        return (<Button component={RouterLink} to={['/systems', command.namespace, command.systemName, command.systemVersion, "commands", command.name].join('/')} variant="contained" color="primary">
                  Make it Happen
                </Button>);
      }

      render() {
        return (
        <Box>
          <PageHeader title = {this.title} />
          <Divider />
          <Breadcrumbs breadcrumbs = {this.breadcrumbs} />
          <Table self = {this} updateData = {this.updateData} button = {this.makeItHappenButton} includePageNav = {true} />
        </Box>
        )
      }
    }

    export default CommandsApp;