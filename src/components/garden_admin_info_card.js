import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';


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

    return (
        <Box width={1/3} pb={1} >
            <Card className={classes.root}>
              <AppBar color="inherit" style={{ background: 'lightgray' }} position="static">
                  <Toolbar>
                      <Typography variant="h6" color="inherit" type="title">Garden Info</Typography>
                  </Toolbar>
              </AppBar>
              <CardContent>
                <Table >
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                Name:
                            </TableCell>
                            <TableCell>
                                {garden.name}
                            </TableCell>
                        </TableRow>
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
                                Known Namespaces:
                            </TableCell>
                            <TableCell>
                                <List className={classes.rootList} >
                                    {(garden.namespaces).map((namespace) => (
                                        <ListItem>{'\u25CF'} {namespace}</ListItem>
                                    ))}
                                </List>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                Connection Type:
                            </TableCell>
                            <TableCell>
                                {garden.connection_type}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
              </CardContent>
            </Card>
        </Box>
    );
}

export default GardenInfoCard