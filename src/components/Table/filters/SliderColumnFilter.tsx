import { Box, Button, TextField } from '@mui/material'
import { useMemo } from 'react'
import { FilterProps } from 'react-table'
import { TableData } from '../Table'
import { getMinAndMax } from './filterHelpers'

const SliderColumnFilter = ({
  column: { render, filterValue, setFilter, preFilteredRows, id },
}: FilterProps<TableData>) => {
  const [min, max] = useMemo(
    () => getMinAndMax(preFilteredRows, id),
    [preFilteredRows, id],
  )

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <TextField
        name={id}
        label={render('Header')}
        type="range"
        inputProps={{ min: min, max: max }}
        value={filterValue || min}
        onChange={(event) => {
          setFilter(parseInt(event.target.value, 10))
        }}
        sx={{ width: '65%' }}
      />
      <Button
        variant="outlined"
        style={{ width: 60, height: 36 }}
        onClick={() => setFilter(undefined)}
      >
        Off
      </Button>
    </Box>
  )
}

export { SliderColumnFilter }
