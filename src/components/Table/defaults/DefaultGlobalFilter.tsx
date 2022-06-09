import { Box, TextField } from '@mui/material'
import { useState } from 'react'
import {
  useAsyncDebounce,
  UseGlobalFiltersInstanceProps,
  UseGlobalFiltersOptions,
} from 'react-table'
import { TableData } from '..'

const DefaultGlobalFilter = <T extends TableData>({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}: Pick<
  UseGlobalFiltersInstanceProps<T>,
  'preGlobalFilteredRows' | 'setGlobalFilter'
> &
  Pick<UseGlobalFiltersOptions<T>, 'globalFilter'>) => {
  const count = preGlobalFilteredRows?.length ?? 0
  const [value, setValue] = useState<string>(
    globalFilter ? (globalFilter as string) : '',
  )
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <Box>
      <TextField
        type="search"
        variant="filled"
        value={value || ''}
        onChange={(event) => {
          setValue(event.target.value)
          onChange(event.target.value)
        }}
        placeholder={`Search ${count} records...`}
        sx={{
          fontSize: '1.1rem',
          border: '0',
        }}
      />
    </Box>
  )
}

export { DefaultGlobalFilter }
