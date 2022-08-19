import { FilterValue, IdType, Row } from 'react-table'
import { ObjectWithStringKeys } from 'types/custom-types'

const regex = /([=<>!]*)\s*((?:[0-9].?[0-9]*)+)/

function parseValue(filterValue: FilterValue) {
  const defaultComparator = (val: string) => val === filterValue
  const tokens = regex.exec(filterValue)

  if (!tokens) {
    return defaultComparator
  }

  switch (tokens[1]) {
    case '>':
      return (val: string) => parseFloat(val) > parseFloat(tokens[2])
    case '<':
      return (val: string) => parseFloat(val) < parseFloat(tokens[2])
    case '<=':
      return (val: string) => parseFloat(val) <= parseFloat(tokens[2])
    case '>=':
      return (val: string) => parseFloat(val) >= parseFloat(tokens[2])
    case '=':
      return (val: string) => parseFloat(val) === parseFloat(tokens[2])
    case '!':
      return (val: string) => parseFloat(val) !== parseFloat(tokens[2])
  }

  return defaultComparator
}

// const numericTextFilter = <T extends ObjectWithStringKeys>(
//   rows: Array<Row<T>>,
//   id: Array<IdType<T>>,
//   filterValue: FilterValue,
// ): Array<Row<T>> => {
//   const comparator = parseValue(filterValue)

//   return rows.filter((row) => comparator(row.values[id[0]]))
// }

function numericTextFilter<T extends ObjectWithStringKeys>(
  rows: Array<Row<T>>,
  id: Array<IdType<T>>,
  filterValue: FilterValue,
) {
  const comparator = parseValue(filterValue)

  return rows.filter((row) => comparator(row.values[id[0]]))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// numericTextFilter.autoRemove = (val: any) => !val

export { numericTextFilter }
