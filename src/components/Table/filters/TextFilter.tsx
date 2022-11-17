import { TextField } from '@mui/material'
import { useDebounce } from 'hooks/useDebounce'
import { ChangeEvent, useEffect, useState } from 'react'
import { FilterProps } from 'react-table'
import { ObjectWithStringKeys } from 'types/custom-types'

export const TextFilter = ({ column }: FilterProps<ObjectWithStringKeys>) => {
  const { id, filterValue, setFilter } = column
  const [value, setValue] = useState(filterValue || '')

  useEffect(() => {
    setValue(filterValue || '')
  }, [filterValue])

  const debouncedValue = useDebounce(value, 500)
  useEffect(() => {
    setFilter(debouncedValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue])

  return (
    <TextField
      name={id}
      hiddenLabel
      size="small"
      InputLabelProps={{ htmlFor: id }}
      value={value}
      variant="outlined"
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value)
      }}
      onBlur={(event) => setFilter(event.target.value || undefined)}
    />
  )
}
