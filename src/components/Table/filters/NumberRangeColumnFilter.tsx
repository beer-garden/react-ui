import { Box, InputLabel, TextField } from '@mui/material'
import { TableData } from 'components/Table'
import {
  getMinAndMax,
  useActiveElement,
} from 'components/Table/filters/filterHelpers'
import { Fragment, useMemo } from 'react'
import { FilterProps } from 'react-table'

const NumberRangeColumnFilter = ({
  column: { filterValue = [], render, preFilteredRows, setFilter, id },
}: FilterProps<TableData>) => {
  const [min, max] = useMemo(
    () => getMinAndMax(preFilteredRows, id),
    [preFilteredRows, id],
  )
  const focusedElement = useActiveElement()
  const hasFocus =
    focusedElement &&
    (focusedElement.id === `${id}_1` || focusedElement.id === `${id}_2`)

  return (
    <Fragment>
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
        <TextField
          id={`${id}_1`}
          value={filterValue[0] || ''}
          type="number"
          variant="standard"
          onChange={(event) => {
            const value = event.target.value
            setFilter((previous: number[] = []) => [
              value ? parseInt(value, 10) : undefined,
              previous[1],
            ])
          }}
          placeholder={`Min (${min})`}
          style={{
            width: '80px',
            marginRight: '0.5rem',
          }}
        />
        to
        <TextField
          id={`${id}_2`}
          value={filterValue[1] || ''}
          type="number"
          variant="standard"
          onChange={(event) => {
            const value = event.target.value
            setFilter((previous: number[] = []) => [
              previous[0],
              value ? parseInt(value, 10) : undefined,
            ])
          }}
          placeholder={`Max (${max})`}
          style={{
            width: '80px',
            marginLeft: '0.5rem',
          }}
        />
      </Box>
    </Fragment>
  )
}

export { NumberRangeColumnFilter }
