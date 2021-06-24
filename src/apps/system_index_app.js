import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import {Link as RouterLink} from 'react-router-dom';

import Table from '../components/table';
import PageHeader from '../components/page_header';
import Divider from '../components/divider';


class SystemsApp extends Component {
    systems = this.props.systems;
    state = {
        data: [],
        page: 0,
        rowsPerPage: 5,
        totalItems: null,
        search: "",
        tableKeys: ['namespace', 'name', 'version', 'description', 'commands', 'instances', ''],
        tableHeads: ['Namespace', 'System', 'Version', 'Description', 'Commands', 'Instances', '']
    }
    title = "Systems";
    breadcrumbs = null;

    updateData(self) {
        let state = self.state;
        let newData = self.systems.slice(state.page * state.rowsPerPage, (state.page * state.rowsPerPage + state.rowsPerPage));
        newData = self.formatData(self, newData)
        self.setState({data: newData, totalItems: self.systems.length})
    }

    formatData(self, data) {
        let tempData = [];
        for (let i in data) {
            for (let tableKey in self.state.tableKeys) {
                if (!tempData[i]) {
                    tempData[i] = {};
                }
                if (self.state.tableKeys[tableKey] === "commands" || self.state.tableKeys[tableKey] === "instances") {
                    tempData[i][self.state.tableKeys[tableKey]] = data[i][self.state.tableKeys[tableKey]].length;
                } else if (self.state.tableKeys[tableKey] === "") {
                    tempData[i][self.state.tableKeys[tableKey]] = self.exploreButton(self, data[i]);
                } else {
                    tempData[i][self.state.tableKeys[tableKey]] = data[i][self.state.tableKeys[tableKey]];
                }
            }
        }
        return tempData;
    }

    componentDidMount() {
        this.updateData(this);
    }

    exploreButton(self, system) {
        return (
            <Button component={RouterLink} to={['/systems', system.namespace, system.name, system.version].join('/')}
                    variant="contained" color="primary">
                Explore
            </Button>);
    }

    render() {
        return (
            <div>
                <PageHeader title={this.title} breadcrumbs={this.breadcrumbs}/>
                <Divider/>
                <Table self={this} updateData={this.updateData} includePageNav={true}/>

            </div>
        )
    }
}

export default SystemsApp;