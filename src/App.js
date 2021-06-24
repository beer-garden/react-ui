import React, {Component} from 'react';
import Box from '@material-ui/core/Box';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import {Redirect, Route, Switch} from 'react-router-dom';


import Menu from './components/menu';
import RequestApp from './apps/request_index_app';
import SystemsAdminApp from './apps/system_admin_app';
import GardensAdminApp from './apps/garden_admin_app';
import SystemsApp from './apps/system_index_app';
import CommandsApp from './apps/command_index_app';
import CommandViewApp from './apps/command_view_app';
import RequestViewApp from './apps/request_view_app';
import JobCreateApp from './apps/job_create_app';
import JobsApp from './apps/job_index_app';
import JobViewApp from './apps/job_view_app';
import GardenViewApp from './apps/garden_view_app';
import SystemsService from './services/system_service'


class App extends Component {
    state = {
        systems: null,
        index: 0
    }

    getIndex() {
        let pathname = window.location.pathname.split("/")[1]
        switch (pathname) {
            case "systems":
                return 0;
            case "requests":
                return 1;
            case "jobs":
                return 2;
            case "admin":
                return 3;
            default:
                return 0;
        }
    }

    componentDidMount() {
        SystemsService.dataFetch(this);
    }

    successCallback(response) {
        this.setState({systems: response.data});
    }

    render() {
        if (this.state.systems) {
            return (
                <Box>
                    <Menu/>
                    <Box px={2}>
                        <Switch>
                            <Route path="/systems/:namespace/:system_name/:version/commands/:command_name/"
                                   component={routeProps => <CommandViewApp
                                       systems={this.state.systems} {...routeProps} />}/>
                            <Route path="/systems/:namespace/:system_name/:version/"
                                   component={routeProps => <CommandsApp
                                       systems={this.state.systems} {...routeProps} />}/>
                            <Route path="/systems/:namespace/:system_name/" component={routeProps => <CommandsApp
                                systems={this.state.systems} {...routeProps} />}/>
                            <Route path="/systems/:namespace/" component={routeProps => <CommandsApp
                                systems={this.state.systems} {...routeProps} />}/>
                            <Route path="/systems" component={() => <SystemsApp systems={this.state.systems}/>}/>
                            <Route path="/admin/systems"
                                   component={() => <SystemsAdminApp systems={this.state.systems}/>}/>
                            <Route path="/admin/gardens/:garden_name/"
                                   component={routeProps => <GardenViewApp {...routeProps} />}/>
                            <Route path="/admin/gardens" component={() => <GardensAdminApp/>}/>
                            <Route path="/requests/:id" component={routeProps => <RequestViewApp {...routeProps} />}/>
                            <Route path="/requests" component={() => <RequestApp/>}/>
                            <Route path="/jobs/create" component={routeProps => <JobCreateApp {...routeProps} />}/>
                            <Route path="/jobs/:id" component={routeProps => <JobViewApp {...routeProps} />}/>
                            <Route path="/jobs" component={() => <JobsApp/>}/>
                            <Redirect to="/systems"/>
                        </Switch>
                    </Box>
                </Box>
            )
        } else {
            return (
                <Box>
                    <Menu/>
                    <Backdrop open={true}>
                        <CircularProgress color="inherit"/>
                    </Backdrop>
                </Box>
            )
        }
    }
}

export default App;
