import React, { FC } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Box from "@material-ui/core/Box";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";

import Table from "./table";
import { Garden, TableState } from "../custom_types/custom_types";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  rootList: {
    width: "100%",
    maxHeight: 400,
    maxWidth: 300,
  },
  pos: {
    marginBottom: 12,
  },
});

interface GardenInfoCardProps {
  garden: Garden;
}

const GardenInfoCard: FC<GardenInfoCardProps> = ({
  garden,
}: GardenInfoCardProps) => {
  const classes = useStyles();

  function getNamespaceList(garden: Garden) {
    return (
      <List className={classes.rootList}>
        {garden.namespaces.map((namespace: string) => (
          <ListItem key={namespace}>
            {"\u25CF"} {namespace}
          </ListItem>
        ))}
      </List>
    );
  }

  function getTableData() {
    return [
      ["Name", garden.name],
      ["Status", garden.status],
      ["Known Namespaces", getNamespaceList(garden)],
      ["Systems", garden.systems.length],
    ];
  }

  const state: TableState = {
    formatData: getTableData,
    tableHeads: [],
    includePageNav: false,
    disableSearch: true,
  };

  return (
    <Box width={1 / 3} pb={1}>
      <Card className={classes.root}>
        <AppBar
          color="inherit"
          style={{ background: "lightgray" }}
          position="static"
        >
          <Toolbar>
            <Typography variant="h6" color="inherit">
              Garden Info
            </Typography>
          </Toolbar>
        </AppBar>
        <CardContent>
          <Table parentState={state} />
        </CardContent>
      </Card>
    </Box>
  );
};

export default GardenInfoCard;
