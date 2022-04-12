import { Box, Chip } from '@mui/material'
import { useCallback } from 'react'
import { ColumnInstance, FilterValue, IdType, TableInstance } from 'react-table'
import { TableData } from '../Table'

interface FilterChipBarProps<T extends TableData> {
  instance: TableInstance<T>
}

const parseDate = (date: number) => {
  const newDate = new Date(date)
  return newDate.toISOString()
}

const FilterChipBar = <T extends TableData>({
  instance,
}: FilterChipBarProps<T>) => {
  const getFilterValue = (
    column: ColumnInstance<T>,
    filterValue: FilterValue,
  ) => {
    switch (column.filter) {
      case 'between': {
        const min = filterValue[0]
        const max = filterValue[1]
        return min ? (max ? `${min}-${max}` : `>=${min}`) : `<=${max}`
      }
      case 'betweenDates': {
        const after = filterValue[0]
        const before = filterValue[1]
        return after
          ? before
            ? `${parseDate(after)} through ${parseDate(before)}`
            : `after ${parseDate(after)}`
          : `before ${parseDate(before)}`
      }
    }
    return filterValue
  }

  const {
    allColumns,
    setFilter,
    state: { filters },
  } = instance

  const handleDelete = useCallback(
    (id: string | number) => {
      setFilter(id as IdType<T>, undefined)
    },
    [setFilter],
  )

  return Object.keys(filters).length > 0 ? (
    <Box sx={{ padding: '18px 0 5px 10px', width: '100%' }}>
      <Box
        component="span"
        sx={{ color: '#998', fontSize: '14px', paddingRight: 1 }}
      >
        Active filters:
      </Box>
      {filters &&
        allColumns.map((column) => {
          const filter = filters.find((filter) => filter.id === column.id)
          const value = filter?.value

          return (
            value && (
              <Chip
                key={column.id}
                label={
                  <>
                    <Box
                      component="span"
                      sx={{ fontWeight: 500, marginRight: 1 }}
                    >
                      {column.render('Header')}:
                    </Box>
                    {getFilterValue(column, value)}
                  </>
                }
                onDelete={() => handleDelete(column.id)}
                variant="outlined"
                sx={{ marginRight: 0.5, color: '#222' }}
              />
            )
          )
        })}
    </Box>
  ) : null
}

export { FilterChipBar }
