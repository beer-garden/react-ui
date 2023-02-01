import { Search as SearchIcon } from '@mui/icons-material'
import { Box, InputAdornment, TextField } from '@mui/material'
import { useMountedState } from 'hooks/useMountedState'
import { DateTime } from 'luxon'
import { FilterProps } from 'react-table'
import { ObjectWithStringKeys } from 'types/custom-types'

const DateRangeColumnFilter = ({
  column: { filterValue = [], setFilter, id },
}: FilterProps<ObjectWithStringKeys>) => {
  const [startDate, setStartDate] = useMountedState<string>(
    filterValue[0]
      ? () => {
          const tempDate = DateTime.fromHTTP(
            new Date(filterValue[0]).toUTCString(),
          )
          return tempDate.toFormat('yyyy-MM-dd') + 'T' + tempDate.toFormat('T')
        }
      : '',
  )
  const [endDate, setEndDate] = useMountedState<string>(
    filterValue[1]
      ? () => {
          const tempDate = DateTime.fromHTTP(
            new Date(filterValue[1]).toUTCString(),
          )
          return tempDate.toFormat('yyyy-MM-dd') + 'T' + tempDate.toFormat('T')
        }
      : '',
  )

  const setStart = (input: Date | null) => {
    setFilter((previous: (number | null)[] = []) =>
      input === null && previous[1] === null
        ? null
        : [input, previous[1] || null],
    )
  }

  const setEnd = (input: Date | null) => {
    setFilter((previous: (number | null)[] = []) =>
      input === null && previous[0] === null
        ? null
        : [previous[0] || null, input],
    )
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
      }}
    >
      <TextField
        variant="standard"
        id={`${id}_1_datetime`}
        type="datetime-local"
        value={startDate}
        size="small"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const input = event.target.value
          /* keyboardInputValue is UTC */
          const utc = input === '' ? null : DateTime.fromISO(input).toJSDate()
          setStartDate(input)
          setStart(utc)
        }}
        sx={{ my: -0.5, ml: -1 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />
      to
      <TextField
        variant="standard"
        id={`${id}_2_datetime`}
        type="datetime-local"
        value={endDate}
        size="small"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const input = event.target.value
          /* keyboardInputValue is UTC */
          const utc = input === '' ? null : DateTime.fromISO(input).toJSDate()
          setEndDate(input)
          setEnd(utc)
        }}
        sx={{ my: -0.5, mr: -2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  )
}

export { DateRangeColumnFilter }
