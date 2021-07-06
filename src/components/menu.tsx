import * as React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import {Link as RouterLink} from 'react-router-dom';

import AdminMenu from './admin_menu';
import png from "../fa-beer.png";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    toolbar: theme.mixins.toolbar,
}));

const MenuTabs = () => {
    const classes = useStyles();

    return (
        <Box className={classes.root}>
            <AppBar color="inherit" position="fixed">
                <Toolbar variant='dense'>
                    <img src={png} alt={""} /><Typography style={{flex: 1}} variant="h6" color="inherit">Beer
                    Garden</Typography>
                    <Box display="flex"
                         alignItems="center"
                    >
                        <Box>
                            <Button component={RouterLink} to="/systems">Systems</Button>
                        </Box>
                        <Box>
                            <Button component={RouterLink} to="/requests">Requests</Button>
                        </Box>
                        <Box>
                            <Button component={RouterLink} to="/jobs">Scheduler</Button>
                        </Box>
                        <Box>
                            <AdminMenu/>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box className={classes.toolbar}/>

        </Box>
    );
};


export default MenuTabs