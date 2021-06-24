
    import React, { Component } from 'react';
    import { Link as RouterLink } from 'react-router-dom';
    import Box from '@material-ui/core/Box';
    import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';

	import PageHeader from '../components/page_header';
	import Divider from '../components/divider';
	import Table from '../components/table';
	import RequestService from '../services/request_service';
	import IncludeChildren from '../components/include_children_checkbox';

    class RequestApp extends Component {

	  state = {
        response: {},
        data: [],
        include_children: false,
        page: 0,
        dateStart: "",
        dateEnd: "",
        search: "",
        totalItems: 0,
        totalItemsFiltered: 0,
        rowsPerPage: 5,
        tableKeys: ['command', 'namespace', 'system', 'system_version', 'instance_name', 'status', 'created_at', 'comment'],
        tableHeads: ['Command', 'Namespace', 'System', 'Version', 'Instance', 'Status', 'Created', 'Comment'],
        searchData : {'columns': [{"data":"command","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
               {"data":"namespace","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
               {"data":"system","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
               {"data":"system_version","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
               {"data":"instance_name","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
               {"data":"status","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
               {"data":"created_at","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
               {"data":"comment","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
               {"data":"metadata","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
               {"data":"id"},
               {"data":"parent"}],
               'draw': 1,
               'include_children': false,
               'length': 5,
               'order': [{"column":6,"dir":"desc"}],
               'search': {"value":"","regex":false},
               'start': 0}
      }

      formatUrl(){

      }

      updateData(self){
          let state=self.state;
          state.searchData.start = state.page*state.rowsPerPage;
          state.searchData.length = state.rowsPerPage;
          RequestService.dataFetch(self, state.searchData);
      }

      formatData(self, data){
          let tempData = [];
          for(let i in data){
              for(let tableKey in self.state.tableKeys){
                  if(!tempData[i]){
                      tempData[i] = {};
                  }
                  if(self.state.tableKeys[tableKey] === "command"){
                        if (data[i].parent){
                            tempData[i][self.state.tableKeys[tableKey]] = (
                                <Box>
                                    <RouterLink to={'/requests/'+data[i].parent.id}>
                                        <SubdirectoryArrowRightIcon />
                                    </RouterLink>
                                    <RouterLink to={'/requests/'+data[i].id}>
                                        {data[i][self.state.tableKeys[tableKey]]}
                                    </RouterLink>
                                </Box>
                            );
                        } else {
                            tempData[i][self.state.tableKeys[tableKey]] = (
                                <RouterLink to={'/requests/'+data[i].id}>
                                    {data[i][self.state.tableKeys[tableKey]]}
                                </RouterLink>
                            );
                        }
                  } else if(self.state.tableKeys[tableKey] === "system_version"){
                      tempData[i][self.state.tableKeys[tableKey]] = (
                          <RouterLink to={['/systems',data[i].namespace, data[i].system, data[i].system_version].join('/')}>
                              {data[i][self.state.tableKeys[tableKey]]}
                          </RouterLink>
                      );
                  } else if(self.state.tableKeys[tableKey] === ""){
                      tempData[i][self.state.tableKeys[tableKey]] = self.exploreButton(self, data[i]);
                  } else if(self.state.tableKeys[tableKey].includes("_at")){
                      tempData[i][self.state.tableKeys[tableKey]] = (new Date(data[i][self.state.tableKeys[tableKey]])).toString();
                  } else {
                      tempData[i][self.state.tableKeys[tableKey]] = data[i][self.state.tableKeys[tableKey]];
                  }
              }
          }
          return tempData;
      }

      successCallback(response){
              this.headers = response.headers;
              let data = this.formatData(this, response.data)
              this.setState({ data: data, totalItems: response.headers.recordstotal,  totalItemsFiltered: response.headers.recordsfiltered });
      }

      title = "Requests";
      breadcrumbs = null;
	  componentDidMount() {
	      let state=this.state;
          RequestService.dataFetch(this, state.searchData);
      }

      searchData(self, event, updateData, dateEnd){
        let value = event.target.value;
        if (parseInt(event.target.id) === 6){
            if (!dateEnd){
                self.state.dateStart = value.replace('T','+');
            } else if (dateEnd === "End"){
                self.state.dateEnd = value.replace('T','+');
            }
            value = self.state.dateStart+"~"+self.state.dateEnd;
        }
        self.state.searchData.columns[parseInt(event.target.id)].search.value = value;
        updateData(self);
      }

      render() {
        return (
        <Box>
          <PageHeader title = {this.title} breadcrumbs = {this.breadcrumbs} />
          <Divider />
          <Box display="flex"
                alignItems="flex-end"
            >
            <Box>
                <IncludeChildren self = {this} updateData = {this.updateData} />
            </Box>
          </Box>
          <Table self = {this} updateData = {this.updateData} includePageNav = {true} searchData = {this.searchData}/>
        </Box>
        )
      }
    }

    export default RequestApp;
