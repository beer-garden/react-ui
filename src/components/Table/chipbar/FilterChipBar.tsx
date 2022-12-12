import { Chip, Typography } from '@mui/material'
import { useCallback } from 'react'
import { ColumnInstance, FilterValue, IdType, TableInstance } from 'react-table'
import { ObjectWithStringKeys } from 'types/custom-types'

interface FilterChipBarProps<T extends ObjectWithStringKeys> {
  instance: TableInstance<T>
}

const parseDate = (date: number) => {
  const newDate = new Date(date)
  return newDate.toISOString()
}

const FilterChipBar = <T extends ObjectWithStringKeys>({
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
    <>
      <Typography
        component="span"
        sx={{ ml: '10px', fontSize: '14px', marginRight: 1 }}
      >
        Active filters:
      </Typography>
      {filters &&
        allColumns.map((column) => {
          const filter = filters.find((filter) => filter.id === column.id)
          const value = filter?.value
          return (
            value && (
              <Chip
                key={column.id}
                label={
                  <Typography sx={{ fontWeight: 500, marginRight: 1 }}>
                    {column.render('Header')}: {getFilterValue(column, value)}
                  </Typography>
                }
                onDelete={() => handleDelete(column.id)}
                variant="outlined"
                sx={{ marginRight: 0.5 }}
              />
            )
          )
        })}
    </>
  ) : null
}

export { FilterChipBar }
