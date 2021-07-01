import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import {Link as RouterLink} from 'react-router-dom';

import PageHeader from '../components/page_header';
import Divider from '../components/divider';
import Breadcrumbs from '../components/breadcrumbs';
import SystemsService from '../services/system_service';
import Table from '../components/table';

type MyProps = {
    systems: any;
    match: any;
}
type MyState = {
    data: any[];
    page: number;
    rowsPerPage: number;
    totalItems: number | null;
    search: string;
    tableKeys: string[];
    tableHeads: string[];
}

class CommandsApp extends Component<MyProps,MyState> {
    systems = this.props.systems;
    commands = [];
    namespace = null;
    systemName = null;
    systemVersion = null;
    state: MyState = {
        data: [],
        page: 0,
        rowsPerPage: 5,
        totalItems: null,
        search: "",
        tableKeys: ['namespace', 'systemName', 'systemVersion', 'name', 'description', ''],
        tableHeads: ['Namespace', 'System', 'Version', 'Command', 'Description', '']
    }
    title = "Commands";
    breadcrumbs: any = null;

    updateData() {
        let state = this.state;
        let newData: any[] = this.commands.slice(state.page * state.rowsPerPage, (state.page * state.rowsPerPage + state.rowsPerPage));
        newData = this.formatData(newData)
        this.setState({data: newData, totalItems: this.commands.length})
    }

    componentDidMount() {
        const {namespace, system_name, version} = this.props.match.params;
        this.namespace = namespace;
        this.systemName = system_name;
        this.systemVersion = version;
        let systems = SystemsService.filterSystems(this.systems, {
            namespace: namespace,
            name: system_name,
            version: version
        });
        for (let i in systems) {
            for (let k in systems[i].commands) {
                systems[i].commands[k]['namespace'] = systems[i].namespace;
                systems[i].commands[k]['systemName'] = systems[i].name;
                systems[i].commands[k]['systemVersion'] = systems[i].version;
            }
            this.commands = this.commands.concat(systems[i].commands)
        }
        this.breadcrumbs = [namespace, system_name, version].filter(function (x) {
            return x !== undefined;
        });
        this.updateData();
    }

    formatData(data: any[]) {
        let tempData: any[] = [];
        for (let i in data) {
            for (let tableKey in this.state.tableKeys) {
                if (!tempData[i]) {
                    tempData[i] = {};
                }
                if (this.state.tableKeys[tableKey] === "") {
                    tempData[i][this.state.tableKeys[tableKey]] = this.makeItHappenButton(data[i]);
                } else if (this.state.tableKeys[tableKey] === "description") {
                    tempData[i][this.state.tableKeys[tableKey]] = data[i][this.state.tableKeys[tableKey]] || "No Description Provided";
                } else {
                    tempData[i][this.state.tableKeys[tableKey]] = data[i][this.state.tableKeys[tableKey]];
                }
            }
        }
        return tempData;
    }

    makeItHappenButton(command: any) {
        return (<Button component={RouterLink}
                        to={['/systems', command.namespace, command.systemName, command.systemVersion, "commands", command.name].join('/')}
                        variant="contained" color="primary">
            Make it Happen
        </Button>);
    }

    render() {
        return (
            <Box>
                <PageHeader title={this.title} description={""}/>
                <Divider/>
                <Breadcrumbs breadcrumbs={this.breadcrumbs}/>
                <Table self={this} disableSearch={false} includePageNav={true}/>
            </Box>
        )
    }
}

export default CommandsApp;