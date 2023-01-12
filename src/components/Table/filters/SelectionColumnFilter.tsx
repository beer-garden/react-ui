import { Search as SearchIcon } from '@mui/icons-material'
import { InputAdornment, MenuItem, TextField } from '@mui/material'
import { useMemo } from 'react'
import { FilterProps } from 'react-table'
import { ObjectWithStringKeys } from 'types/custom-types'

const SelectionColumnFilter = ({
  column: { filterValue, setFilter, preFilteredRows, id, selectionOptions },
}: FilterProps<ObjectWithStringKeys>) => {
  const options = useMemo(() => {
    let options: Set<string>

    if (selectionOptions) {
      options = new Set(selectionOptions)
    } else {
      options = new Set()
      preFilteredRows.forEach((row) => {
        options.add(row.values[id])
      })
    }

    return [...Array.from(options.values())]
  }, [id, preFilteredRows, selectionOptions])

  return (
    <TextField
      select
      size="small"
      name={id}
      sx={{ my: -0.5 }}
      variant="standard"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" />
          </InputAdornment>
        ),
      }}
      value={filterValue || ''}
      onChange={(event) => {
        setFilter(event.target.value || undefined)
      }}
    >
      <MenuItem value={''} dense>
        All
      </MenuItem>
      {options.map((option, index) => (
        <MenuItem key={index} value={option} dense>
          {option}
        </MenuItem>
      ))}
    </TextField>
  )
}

export { SelectionColumnFilter }
