import { TextField, Tooltip } from '@mui/material'
import { ChangeEvent, useEffect, useState } from 'react'
import { FilterProps } from 'react-table'
import { ObjectWithStringKeys } from 'types/custom-types'

export const TextFilter = ({ column }: FilterProps<ObjectWithStringKeys>) => {
  const { id, filterValue, setFilter } = column
  const [value, setValue] = useState(filterValue || '')
  const [open, setOpen] = useState<boolean>(false)

  useEffect(() => {
    setValue(filterValue || '')
  }, [filterValue])

  return (
    <Tooltip
      arrow
      open={open}
      title="Press Enter or click outside the input to submit."
    >
      <TextField
        name={id}
        hiddenLabel
        size="small"
        InputLabelProps={{ htmlFor: id }}
        value={value}
        variant="outlined"
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            setFilter(value || undefined)
          }
        }}
        onFocus={() => {
          setOpen(true)
          setTimeout(() => {
            setOpen(false)
          }, 5000)
        }}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setValue(event.target.value)
        }}
        onBlur={(event) => {
          setFilter(event.target.value || undefined)
          setOpen(false)
        }}
      />
    </Tooltip>
  )
}
