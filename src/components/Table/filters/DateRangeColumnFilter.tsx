import { Box, InputLabel, TextField } from '@mui/material'
import { TableData } from 'components/Table'
import { useActiveElement } from 'components/Table/filters/filterHelpers'
import moment from 'moment-timezone'
import { Fragment, useState } from 'react'
import { FilterProps } from 'react-table'
const DateRangeColumnFilter = ({
  state,
  gotoPage,
  column: { filterValue = [], render, setFilter, id },
}: FilterProps<TableData>) => {
  const [startDate, setStartDate] = useState<string>(
    filterValue[0]
      ? moment.utc(filterValue[0]).local(true).format('YYYY-MM-DDTHH:mm')
      : '',
  )
  const [endDate, setEndDate] = useState<string>(
    filterValue[1]
      ? moment.utc(filterValue[1]).local(true).format('YYYY-MM-DDTHH:mm')
      : '',
  )

  const focusedElement = useActiveElement()
  const hasFocus = focusedElement
    ? focusedElement.id.startsWith(`${id}_1`) ||
      focusedElement.id.startsWith(`${id}_2`)
    : false

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
    <Fragment>
      <InputLabel htmlFor={id} shrink focused={hasFocus}>
        {render('Header')} (UTC)
      </InputLabel>
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
            const utc = input === '' ? null : moment.utc(input).toDate()
            setStartDate(input)
            setStart(utc)
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
            const utc = input === '' ? null : moment.utc(input).toDate()
            setEndDate(input)
            setEnd(utc)
          }}
        />
      </Box>
    </Fragment>
  )
}

export default DateRangeColumnFilter
