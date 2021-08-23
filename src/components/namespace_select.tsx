import React, { BaseSyntheticEvent, FC } from "react";
import {
  Checkbox,
  Chip,
  FormControl,
  Input,
  InputLabel,
  Select,
} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import CacheService from "../services/cache_service";

interface NamespaceSelectProps {
  namespaces: string[];
  namespacesSelected: string[];
  setNamespacesSelected(value: string[]): void;
}

const useStyles = makeStyles((theme) => ({
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 255,
  },
}));

const NamespaceSelect: FC<NamespaceSelectProps> = ({
  namespaces,
  namespacesSelected,
  setNamespacesSelected,
}: NamespaceSelectProps) => {
  const classes = useStyles();
  const handleChange = (event: BaseSyntheticEvent) => {
    let selected: string[] = [];
    if (event.target.value.includes("showAll")) {
      if (namespaces.length !== namespacesSelected.length) {
        selected = namespaces;
      }
    } else {
      selected = event.target.value.sort();
    }
    CacheService.setItemInCache(
      { namespacesSelected: selected },
      `lastKnown_${window.location.href}`
    );
    setNamespacesSelected(selected);
  };

  return (
    <FormControl size="small" className={classes.formControl}>
      <InputLabel id="namespaceSelectLabel">Namespaces:</InputLabel>
      <Select
        labelId="namespaceSelectLabel"
        value={namespacesSelected}
        onChange={handleChange}
        input={<Input />}
        multiple
        renderValue={(selected) => (
          <div className={classes.chips}>
            {(selected as string[]).map((value: string) => (
              <Chip key={value} label={value} className={classes.chip} />
            ))}
          </div>
        )}
      >
        <MenuItem value={"showAll"} key={"select all"}>
          <Checkbox checked={namespaces.length === namespacesSelected.length} />
          Select All
        </MenuItem>
        {namespaces.map((namespace: string) => (
          <MenuItem value={namespace} key={namespace + "select"}>
            <Checkbox checked={namespacesSelected.indexOf(namespace) > -1} />
            {namespace}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default NamespaceSelect;
