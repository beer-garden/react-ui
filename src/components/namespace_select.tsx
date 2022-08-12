import { makeStyles } from '@material-ui/core/styles' // TODO
import {
  Checkbox,
  Chip,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
} from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import React from 'react'

import { NamespacesSelectedContext } from '../pages/SystemAdmin'

const useStyles = makeStyles((theme) => ({
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 255,
  },
}))

const NamespaceSelect = () => {
  const classes = useStyles()
  const { namespaces, namespacesSelected, setNamespacesSelected } =
    React.useContext(NamespacesSelectedContext)
  const handleChange = (event: SelectChangeEvent<typeof namespaces>) => {
    const {
      target: { value },
    } = event

    let selected: string[] = []
    const theValue = typeof value === 'string' ? value.split(',') : value

    if (theValue.includes('showAll')) {
      if (namespaces.length !== namespacesSelected.length) {
        selected = namespaces
      }
    } else {
      selected = theValue.sort()
    }
    setNamespacesSelected(selected)
  }

  return (
    <FormControl size="small" className={classes.formControl}>
      <InputLabel id="namespaceSelectLabel">Namespaces:</InputLabel>
      <Select
        labelId="namespaceSelectLabel"
        multiple
        value={namespacesSelected}
        onChange={handleChange}
        input={<Input />}
        renderValue={(selected) => (
          <div className={classes.chips}>
            {(selected as string[]).map((value: string) => (
              <Chip key={value} label={value} className={classes.chip} />
            ))}
          </div>
        )}
      >
        <MenuItem value={'showAll'} key={'select all'}>
          <Checkbox
            color="secondary"
            checked={namespaces.length === namespacesSelected.length}
          />
          Select All
        </MenuItem>
        {namespaces.map((namespace: string) => (
          <MenuItem value={namespace} key={namespace + 'select'}>
            <Checkbox
              color="secondary"
              checked={namespacesSelected.indexOf(namespace) > -1}
            />
            {namespace}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default NamespaceSelect
