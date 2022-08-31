import { matchSorter } from 'match-sorter'
import { FilterValue, IdType, Row } from 'react-table'
import { ObjectWithStringKeys } from 'types/custom-types'

const fuzzyTextFilter = <T extends ObjectWithStringKeys>(
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
