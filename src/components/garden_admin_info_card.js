import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';

import Table from "../components/table"

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  rootList: {
      width: '100%',
      maxHeight: 400,
      maxWidth: 300,
    },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const GardenInfoCard =({garden}) => {

    const classes = useStyles();

    function getNamespaceList(garden){
        return(<List className={classes.rootList} >
               {(garden.namespaces).map((namespace) => (
                   <ListItem>{'\u25CF'} {namespace}</ListItem>
               ))}
           </List>)
    }

    let self = {state: {data: [["Name",garden.name],["Status",garden.status],["Known Namespaces",getNamespaceList(garden)],["Systems",garden.systems.length]], tableKeys: [0,1]}}

    return (
        <Box width={1/3} pb={1} >
            <Card className={classes.root}>
              <AppBar color="inherit" style={{ background: 'lightgray' }} position="static">
                  <Toolbar>
                      <Typography variant="h6" color="inherit" type="title">Garden Info</Typography>
                  </Toolbar>
              </AppBar>
              <CardContent>
                <Table self = {self} />
              </CardContent>
            </Card>
        </Box>
    );
}

export default GardenInfoCard