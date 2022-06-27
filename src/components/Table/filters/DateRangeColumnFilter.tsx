import { Box, InputLabel, TextField } from '@mui/material'
import { DesktopDateTimePicker } from '@mui/x-date-pickers/'
import { TableData } from 'components/Table'
import { useActiveElement } from 'components/Table/filters/filterHelpers'
import moment from 'moment'
import { useState } from 'react'
import { FilterProps } from 'react-table'

const isValidDateString = (input: string) =>
  moment.utc(input, 'MM/DD/YYYY HH:mm', true).isValid()

const toUtc = (input: string) => {
  return moment
    .utc(moment(input).format('MM/DD/YYYY HH:mm'), 'MM/DD/YYYY HH:mm', true)
    .valueOf()
}

const DateRangeColumnFilter = ({
  state,
  gotoPage,
  column: { filterValue = [], render, setFilter, id },
}: FilterProps<TableData>) => {
  const [startDate, setStartDate] = useState<Date | null>(
    filterValue && filterValue[0]
      ? moment.utc(filterValue[0]).local(true).toDate()
      : null,
  )
  const [endDate, setEndDate] = useState<Date | null>(
    filterValue && filterValue[1]
      ? moment.utc(filterValue[1]).local(true).toDate()
      : null,
  )

  const focusedElement = useActiveElement()
  const hasFocus =
    focusedElement &&
    (focusedElement.id.startsWith(`${id}_1`) ||
      focusedElement.id.startsWith(`${id}_2`))

  const setStart = (input: Date) => {
    setFilter((previous: (number | null)[] = []) => [
      moment(input).valueOf(),
      previous[1] || null,
    ])
  }

  const setEnd = (input: Date) => {
    setFilter((previous: (number | null)[] = []) => [
      previous[0] || null,
      moment(input).valueOf(),
    ])
  }

  return (
    <>
      <InputLabel htmlFor={id} shrink focused={!!hasFocus}>
        {render('Header')}
      </InputLabel>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <DesktopDateTimePicker
          disableFuture
          onChange={(
            date: Date | null,
            keyboardInputValue: string | undefined,
          ) => {
            if (keyboardInputValue && isValidDateString(keyboardInputValue)) {
              /* keyboardInputValue is UTC */
              const local = moment
                .utc(keyboardInputValue, 'MM/DD/YYYY HH:mm', true)
                .local(true)
                .toDate()
              const utc = moment
                .utc(keyboardInputValue, 'MM/DD/YYYY HH:mm', true)
                .toDate()

              setStartDate(local)
              setStart(utc)
              state.pageIndex = 0
              gotoPage(0)
            }
          }}
          onAccept={(date: Date | null) => {
            if (date) {
              /* date is local */
              setStartDate(date)
              setStart(new Date(toUtc(date.toString())))
            }
          }}
          value={startDate}
          renderInput={(params) => {
            const { id: renderId, ...rest } = params
            return (
              <TextField
                size="small"
                id={renderId ? `${id}_1_${renderId}` : `${id}_1`}
                {...rest}
              />
            )
          }}
          ampm={false}
          OpenPickerButtonProps={{ id: `${id}_1_button` }}
        />
         to 
        <DesktopDateTimePicker
          disableFuture
          onChange={(
            date: Date | null,
            keyboardInputValue: string | undefined,
          ) => {
            if (keyboardInputValue && isValidDateString(keyboardInputValue)) {
              /* keyboardInputValue is UTC */
              const local = moment
                .utc(keyboardInputValue, 'MM/DD/YYYY HH:mm', true)
                .local(true)
                .toDate()
              const utc = moment
                .utc(keyboardInputValue, 'MM/DD/YYYY HH:mm', true)
                .toDate()

              setEndDate(local)
              setEnd(utc)
            }
          }}
          onAccept={(date: Date | null) => {
            if (date) {
              /* date is local */
              setEndDate(date)
              setEnd(new Date(toUtc(date.toString())))
            }
          }}
          value={endDate}
          renderInput={(params) => {
            const { id: renderId, ...rest } = params
            return (
              <TextField
                size="small"
                id={renderId ? `${id}_2_${renderId}` : `${id}_2`}
                {...rest}
              />
            )
          }}
          ampm={false}
          OpenPickerButtonProps={{ id: `${id}_1_button` }}
        />
      </Box>
    </>
  )
}

export default DateRangeColumnFilter
