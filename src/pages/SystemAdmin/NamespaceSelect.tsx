import {
  Checkbox,
  Chip,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
} from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { useTheme } from '@mui/material/styles'
import { NamespacesSelectedContext } from 'pages/SystemAdmin'
import { useContext } from 'react'

const NamespaceSelect = () => {
  const theme = useTheme()
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
    <FormControl
      size="small"
      sx={{
        margin: theme.spacing(1),
        minWidth: 255,
      }}
    >
      <InputLabel id="namespaceSelectLabel">Namespaces:</InputLabel>
      <Select
        labelId="namespaceSelectLabel"
        multiple
        value={namespacesSelected}
        onChange={handleChange}
        input={<Input />}
        renderValue={(selected) => (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            {(selected as string[]).map((value: string) => (
              <Chip key={value} label={value} sx={{ margin: 2 }} />
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

export { NamespaceSelect }
