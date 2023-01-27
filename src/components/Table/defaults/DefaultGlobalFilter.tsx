import { Box, TextField } from '@mui/material'
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
        type="search"
        variant="outlined"
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
