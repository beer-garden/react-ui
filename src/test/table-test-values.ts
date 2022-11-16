import {
  Cell,
  CellPropGetter,
  ColumnInstance,
  FilterValue,
  Row,
  TableCellProps,
} from 'react-table'
import { ObjectWithStringKeys } from 'types/custom-types'

export const TColumn = {
  render: (a: string) => {
    return a
  },
}

export const TCell: Cell<ObjectWithStringKeys> = {
  value: 'DisplayValue',
  column: TColumn as ColumnInstance<ObjectWithStringKeys>,
  row: {} as Row<ObjectWithStringKeys>,
  getCellProps: (
    propGetter?: CellPropGetter<ObjectWithStringKeys> | undefined,
  ): TableCellProps => {
    return { key: 'test' }
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  render: (type: string, userProps?: object | undefined) => {},
  isGrouped: false,
  isPlaceholder: false,
  isAggregated: false,
  state: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setState: (updater: unknown) => {},
}

export const TFilter: FilterValue = {
  id: 'testColumn',
  filterValue: 'DisplayText',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setFilter: () => {},
}

export const TDateFilter: FilterValue = {
  id: 'testColumn',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setFilter: () => {},
  filterValue: [
    'Fri Oct 14 2022 09:01:00 GMT-0700 (Pacific Daylight Time)',
    'Thu Nov 24 2022 08:02:00 GMT-0800 (Pacific Standard Time)',
  ],
}

export const TSelectFilter: FilterValue = {
  id: 'testColumn',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setFilter: () => {},
  preFilteredRows: [],
  selectionOptions: ['optionThree', 'optionOne', 'optionTwo'],
  filterValue: 'optionThree',
}

export const TNumberFilter: FilterValue = {
  id: 'testColumn',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setFilter: () => {},
  preFilteredRows: [
    { values: { testColumn: 42 } },
    { values: { testColumn: 6 } },
    { values: { testColumn: 18 } },
  ],
  filterValue: [6, 42],
}
