import { MenuItem, TextField } from '@mui/material'
import { useMemo } from 'react'
import { FilterProps } from 'react-table'
import { TableData } from '../Table'

const SelectionColumnFilter = ({
  column: {
    filterValue,
    render,
    setFilter,
    preFilteredRows,
    id,
    selectionOptions,
  },
}: FilterProps<TableData>) => {
  const options = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let options: Set<any>

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
      label={render('Header')}
      value={filterValue || ''}
      onChange={(event) => {
        setFilter(event.target.value || undefined)
      }}
    >
      <MenuItem value={''}>All</MenuItem>
      {options.map((option, index) => (
        <MenuItem key={index} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  )
}

export { SelectionColumnFilter }
