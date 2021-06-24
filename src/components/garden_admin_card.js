import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import GardenService from "../services/garden_service"

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const GardenAdminCard =({garden}) => {

    const classes = useStyles();

    function getDeleteButton(connection_type){
        if(connection_type!=="LOCAL"){
            return(
                <Button onClick={() => GardenService.deleteGarden(garden.name)} variant="contained" color="secondary" >
                    Delete {garden.name}
                </Button>
            );
        }
    }

    function localOrRemote(connection_type){
        if(connection_type==="LOCAL"){
            return "(LOCAL)";
        } else {
            return "(REMOTE)";
        }
    }

    return (


    <Card className={classes.root}>
      <AppBar color="inherit" style={{ background: 'lightgray' }} position="static">
          <Toolbar>
              <Typography variant="h6" color="inherit" type="title">{garden.name} {localOrRemote(garden.connection_type)}</Typography>
          </Toolbar>
      </AppBar>
      <CardContent>
        <Table >
            <TableBody>
                <TableRow>
                    <TableCell>
                        Status:
                    </TableCell>
                    <TableCell>
                        {garden.status}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>
                        Namespaces:
                    </TableCell>
                    <TableCell>
                        {garden.namespaces.length}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>
                        Systems:
                    </TableCell>
                    <TableCell>
                        {garden.systems.length}
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
      </CardContent>
      <CardActions>
        <Button variant="contained" color="primary" component={RouterLink} to={"/admin/gardens/"+garden.name}>
            Edit {garden.name} configurations
        </Button>
        {getDeleteButton(garden.connection_type)}
      </CardActions>
    </Card>
    );
}

export default GardenAdminCard