import React, {Component} from 'react';
import {Link as RouterLink} from 'react-router-dom';
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
    }
    searchDataAPI: any = {
        'columns': [{
            "data": "command",
            "name": "",
            "searchable": true,
            "orderable": true,
            "search": {"value": "", "regex": false}
        },
            {
                "data": "namespace",
                "name": "",
                "searchable": true,
                "orderable": true,
                "search": {"value": "", "regex": false}
            },
            {
                "data": "system",
                "name": "",
                "searchable": true,
                "orderable": true,
                "search": {"value": "", "regex": false}
            },
            {
                "data": "system_version",
                "name": "",
                "searchable": true,
                "orderable": true,
                "search": {"value": "", "regex": false}
            },
            {
                "data": "instance_name",
                "name": "",
                "searchable": true,
                "orderable": true,
                "search": {"value": "", "regex": false}
            },
            {
                "data": "status",
                "name": "",
                "searchable": true,
                "orderable": true,
                "search": {"value": "", "regex": false}
            },
            {
                "data": "created_at",
                "name": "",
                "searchable": true,
                "orderable": true,
                "search": {"value": "", "regex": false}
            },
            {
                "data": "comment",
                "name": "",
                "searchable": true,
                "orderable": true,
                "search": {"value": "", "regex": false}
            },
            {
                "data": "metadata",
                "name": "",
                "searchable": true,
                "orderable": true,
                "search": {"value": "", "regex": false}
            },
            {"data": "id"},
            {"data": "parent"}],
        'draw': 1,
        'include_children': false,
        'length': 5,
        'order': [{"column": 6, "dir": "desc"}],
        'search': {"value": "", "regex": false},
        'start': 0
    };
    title = "Requests";
    headers: any;

    updateData() {
        let state = this.state;
        this.searchDataAPI.start = state.page * state.rowsPerPage;
        this.searchDataAPI.length = state.rowsPerPage;
        RequestService.dataFetch(this, this.searchDataAPI);
    }

    formatData(data: any[]) {
        let tempData: any = [];
        for (let i in data) {
            for (let tableKey in this.state.tableKeys) {
                if (!tempData[i]) {
                    tempData[i] = {};
                }
                if (this.state.tableKeys[tableKey] === "command") {
                    if (data[i].parent) {
                        tempData[i][this.state.tableKeys[tableKey]] = (
                            <Box>
                                <RouterLink to={'/requests/' + data[i].parent.id}>
                                    <SubdirectoryArrowRightIcon/>
                                </RouterLink>
                                <RouterLink to={'/requests/' + data[i].id}>
                                    {data[i][this.state.tableKeys[tableKey]]}
                                </RouterLink>
                            </Box>
                        );
                    } else {
                        tempData[i][this.state.tableKeys[tableKey]] = (
                            <RouterLink to={'/requests/' + data[i].id}>
                                {data[i][this.state.tableKeys[tableKey]]}
                            </RouterLink>
                        );
                    }
                } else if (this.state.tableKeys[tableKey] === "system_version") {
                    tempData[i][this.state.tableKeys[tableKey]] = (
                        <RouterLink
                            to={['/systems', data[i].namespace, data[i].system, data[i].system_version].join('/')}>
                            {data[i][this.state.tableKeys[tableKey]]}
                        </RouterLink>
                    );
                } else if (this.state.tableKeys[tableKey].includes("_at")) {
                    tempData[i][this.state.tableKeys[tableKey]] = (new Date(data[i][this.state.tableKeys[tableKey]])).toString();
                } else {
                    tempData[i][this.state.tableKeys[tableKey]] = data[i][this.state.tableKeys[tableKey]];
                }
            }
        }
        return tempData;
    }

    successCallback(response: any) {
        this.headers = response.headers;
        let data = this.formatData(response.data)
        this.setState({
            data: data,
            totalItems: response.headers.recordstotal,
            totalItemsFiltered: response.headers.recordsfiltered
        });
    }

    componentDidMount() {
        RequestService.dataFetch(this, this.searchDataAPI);
    }

    searchData(event: any, dateEnd: boolean = false) {
        let value = event.target.value;
        if (parseInt(event.target.id) === 6) {
            if (dateEnd) {
                this.state.dateStart = value.replace('T', '+');
            } else if (dateEnd) {
                this.state.dateEnd = value.replace('T', '+');
            }
            value = this.state.dateStart + "~" + this.state.dateEnd;
        }
        this.searchDataAPI.columns[parseInt(event.target.id)].search.value = value;
        this.updateData();
    }

    render() {
        return (
            <Box>
                <PageHeader title={this.title} description={""}/>
                <Divider/>
                <Box display="flex"
                     alignItems="flex-end"
                >
                    <Box>
                        <IncludeChildren self={this} />
                    </Box>
                </Box>
                <Table self={this} includePageNav={true} disableSearch={false}/>
            </Box>
        )
    }
}

export default RequestApp;
