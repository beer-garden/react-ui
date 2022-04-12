import { matchSorter } from 'match-sorter'
import { FilterValue, IdType, Row } from 'react-table'
import { TableData } from '../Table'

const fuzzyTextFilter = <T extends TableData>(
  rows: Array<Row<T>>,
  id: Array<IdType<T>>,
  filterValue: FilterValue,
): Array<Row<T>> => {
  return matchSorter(rows, filterValue, {
    keys: [(row: Row<T>) => row.values[id[0]]],
  })
}

fuzzyTextFilter.autoRemove = (val: unknown) => !val

export { fuzzyTextFilter }
