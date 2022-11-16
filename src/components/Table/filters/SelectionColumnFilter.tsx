import { FormControl, MenuItem, Select } from '@mui/material'
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
    <FormControl sx={{ m: 0.1, py: 0.1 }} size="small">
      <Select
        sx={{
          marginRight: '0.5rem',
          py: 0.1,
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
      </Select>
    </FormControl>
  )
}

export { SelectionColumnFilter }
