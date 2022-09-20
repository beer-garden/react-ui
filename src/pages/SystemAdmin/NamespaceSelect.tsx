import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
} from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { NamespacesSelectedContext } from 'pages/SystemAdmin'
import { useContext } from 'react'

const NamespaceSelect = () => {
  const { namespaces, namespacesSelected, setNamespacesSelected } = useContext(
    NamespacesSelectedContext,
  )
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
    <FormControl size="small" sx={{ minWidth: 255 }}>
      <InputLabel id="namespaceSelectLabel">Namespaces:</InputLabel>
      <Select
        labelId="namespaceSelectLabel"
        multiple
        value={namespacesSelected}
        onChange={handleChange}
        input={<OutlinedInput label="Namespace" />}
        renderValue={(selected) => (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0.5,
            }}
          >
            {selected.map((value: string) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
      >
        <MenuItem dense value={'showAll'} key={'select all'}>
          <Checkbox
            color="secondary"
            checked={namespaces.length === namespacesSelected.length}
          />
          Select All
        </MenuItem>
        {namespaces.map((namespace: string) => (
          <MenuItem dense value={namespace} key={namespace + 'select'}>
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

export { NamespaceSelect }
