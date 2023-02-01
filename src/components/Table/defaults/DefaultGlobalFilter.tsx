import { Clear as ClearIcon, Search as SearchIcon } from '@mui/icons-material'
import { Box, IconButton, InputAdornment, TextField } from '@mui/material'
import { useMountedState } from 'hooks/useMountedState'
import {
  useAsyncDebounce,
  UseGlobalFiltersInstanceProps,
  UseGlobalFiltersOptions,
} from 'react-table'
import { ObjectWithStringKeys } from 'types/custom-types'

const DefaultGlobalFilter = <T extends ObjectWithStringKeys>({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}: Pick<
  UseGlobalFiltersInstanceProps<T>,
  'preGlobalFilteredRows' | 'setGlobalFilter'
> &
  Pick<UseGlobalFiltersOptions<T>, 'globalFilter'>) => {
  const count = preGlobalFilteredRows?.length ?? 0
  const [value, setValue] = useMountedState<string>(
    globalFilter ? (globalFilter as string) : '',
  )
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <Box>
      <TextField
        variant="standard"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: value && (
            <InputAdornment position="end">
              <IconButton
                onClick={() => {
                  setValue('')
                  onChange('')
                }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
        size="small"
        color="secondary"
        value={value || ''}
        onChange={(event) => {
          setValue(event.target.value)
          onChange(event.target.value)
        }}
        placeholder={`Search ${count} records...`}
        sx={{
          fontSize: '1.1rem',
        }}
      />
    </Box>
  )
}

export { DefaultGlobalFilter }
