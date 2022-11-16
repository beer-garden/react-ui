import { TextField } from '@mui/material'
import { ChangeEvent, useEffect, useState } from 'react'
import { FilterProps } from 'react-table'
import { ObjectWithStringKeys } from 'types/custom-types'

export const TextFilter = ({ column }: FilterProps<ObjectWithStringKeys>) => {
  const { id, filterValue, setFilter } = column
  const [value, setValue] = useState(filterValue || '')
  const [debounce, setDebounce] = useState<NodeJS.Timeout | undefined>()

  useEffect(() => {
    setValue(filterValue || '')
  }, [filterValue])

  useEffect(() => {
    if (debounce) {
      clearTimeout(debounce)
      setDebounce(undefined)
    }
    setDebounce(
      setTimeout(() => {
        setFilter(value)
      }, 500),
    )
    return () => {
      clearTimeout(debounce)
      setDebounce(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

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
