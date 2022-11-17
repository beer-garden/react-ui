import { Box, TextField } from '@mui/material'
import { DateTime } from 'luxon'
import { useState } from 'react'
import { FilterProps } from 'react-table'
import { ObjectWithStringKeys } from 'types/custom-types'

const DateRangeColumnFilter = ({
  column: { filterValue = [], setFilter, id },
}: FilterProps<ObjectWithStringKeys>) => {
  const [startDate, setStartDate] = useState<string>(
    filterValue[0]
      ? () => {
          const tempDate = DateTime.fromHTTP(
            new Date(filterValue[0]).toUTCString(),
          )
          return tempDate.toFormat('yyyy-MM-dd') + 'T' + tempDate.toFormat('T')
        }
      : '',
  )
  const [endDate, setEndDate] = useState<string>(
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
        style={{
          marginRight: '0.5rem',
        }}
      />
      to
      <TextField
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
        style={{
          marginLeft: '0.5rem',
        }}
      />
    </Box>
  )
}

export { DateRangeColumnFilter }
