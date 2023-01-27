import { Search as SearchIcon } from '@mui/icons-material'
import { InputAdornment, TextField, Tooltip } from '@mui/material'
import { useMountedState } from 'hooks/useMountedState'
import { ChangeEvent, useEffect } from 'react'
import { FilterProps } from 'react-table'
import { ObjectWithStringKeys } from 'types/custom-types'

export const TextFilter = ({ column }: FilterProps<ObjectWithStringKeys>) => {
  const { id, filterValue, setFilter } = column
  const [value, setValue] = useMountedState<string>(filterValue || '')
  const [open, setOpen] = useMountedState<boolean>(false)

  useEffect(() => {
    setValue(filterValue || '')
  }, [filterValue, setValue])

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
        sx={{ my: -0.5 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
        InputLabelProps={{ htmlFor: id + 'Filter' }}
        placeholder={id + ' filter'}
        value={value}
        variant="standard"
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
