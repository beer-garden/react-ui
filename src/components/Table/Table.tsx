import { KeyboardArrowUp } from '@mui/icons-material'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import { Box, Stack, TableSortLabel, Tooltip } from '@mui/material'
import {
  ColumnResizeHandle,
  FilterChipBar,
  TablePagination,
  Toolbar,
} from 'components/Table'
import {
  defaultColumnValues,
  DefaultGlobalFilter,
  DefaultHeader,
} from 'components/Table/defaults'
import {
  fuzzyTextFilter,
  InlineFilter,
  numericTextFilter,
  TextFilter,
} from 'components/Table/filters'
import { OverflowCellRenderer } from 'components/Table/render'
import {
  Table as StyledTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableHeadRow,
  TableLabel,
  TableRow,
} from 'components/Table/TableComponentsStyled'
import { useDebounce } from 'hooks/useDebounce'
import { useLocalStorage } from 'hooks/useLocalStorage'
import {
  CSSProperties,
  Dispatch,
  PropsWithChildren,
  ReactElement,
  SetStateAction,
  useCallback,
  useEffect,
} from 'react'
import {
  Column,
  TableOptions,
  TableState,
  useColumnOrder,
  useExpanded,
  useFilters,
  useFlexLayout,
  useGlobalFilter,
  useGroupBy,
  usePagination,
  useResizeColumns,
  useRowSelect,
  useSortBy,
  useTable,
} from 'react-table'
import { ObjectWithStringKeys } from 'types/custom-types'

const filterTypes = {
  fuzzyText: fuzzyTextFilter,
  numeric: numericTextFilter,
}

const columnStyle = {
  style: {
    flex: '1 0 auto',
  },
}

const defaultColumn = {
  Filter: TextFilter,
  Cell: OverflowCellRenderer,
  Header: DefaultHeader,
  minWidth: 90, // minWidth is only used as a limit for resizing
  width: 150, // width is used for both the flex-basis and flex-grow
  maxWidth: 200, // maxWidth is only used as a limit for resizing
  ...defaultColumnValues,
}

const hooks = [
  useColumnOrder,
  useFilters,
  useGroupBy,
  useGlobalFilter,
  useSortBy,
  useExpanded,
  useFlexLayout,
  usePagination,
  useResizeColumns,
  useRowSelect,
]

interface TableProps<T extends ObjectWithStringKeys> extends TableOptions<T> {
  data: T[]
  columns: Column<T>[]
  setSelection?: Dispatch<SetStateAction<T[]>>
  showGlobalFilter?: boolean
  maxrows?: number
  tableName?: string
  tableKey?: string
  hideToolbar?: boolean
  hideSort?: boolean
  hidePagination?: boolean
}

const DEBUG_INITIAL_STATE = false

const Table = <T extends ObjectWithStringKeys>(
  props: PropsWithChildren<TableProps<T>>,
): ReactElement => {
  const {
    tableName,
    tableKey,
    data,
    columns,
    showGlobalFilter,
    setSelection,
    hideToolbar,
    hideSort,
    hidePagination,
    ...childProps
  } = props

  const [initialState, _setInitialState] = useLocalStorage(
    `tableState:${tableKey || tableName}`,
    {} as Partial<TableState<T>>,
  )

  const setInitialState = useCallback(
    (initialState: Partial<TableState<T>>) => {
      if (DEBUG_INITIAL_STATE) {
        console.log('Setting initial state:', initialState)
      }

      _setInitialState(initialState)
    },
    [_setInitialState],
  )

  const instance = useTable<T>(
    {
      data,
      columns,
      filterTypes,
      defaultColumn,
      initialState,
      disableSortRemove: true,
    },
    ...hooks,
  )
  const {
    getTableProps,
    headerGroups,
    getTableBodyProps,
    page,
    prepareRow,
    state,
    selectedFlatRows,
    setGlobalFilter,
    preGlobalFilteredRows,
  } = instance

  const debouncedState = useDebounce(state, 500)

  useEffect(() => {
    if (setSelection) {
      setSelection(selectedFlatRows.map((row) => row.original))
    }
  }, [selectedFlatRows, setSelection])

  useEffect(() => {
    const { filters, pageSize, hiddenColumns } = debouncedState
    let { sortBy } = debouncedState

    if (sortBy.length === 0 && columns) {
      let id, accessor
      const firstColumn = columns[0]

      if (firstColumn) {
        if ('columns' in firstColumn) {
          id = firstColumn.columns[0].id
          accessor = firstColumn.columns[0].accessor
        } else {
          id = firstColumn.id
          accessor = firstColumn.accessor
        }
      }
      if (id) {
        sortBy = [{ id: id }]
      } else if (accessor && typeof accessor === 'string') {
        sortBy = [{ id: accessor }]
      }
    }

    setInitialState({
      sortBy,
      filters,
      pageSize,
      hiddenColumns,
    })
  }, [setInitialState, debouncedState, columns])

  const { role: tableRole, ...tableProps } = getTableProps()

  return (
    <>
      {!hideToolbar && <Toolbar name={tableName || ''} instance={instance} />}
      <FilterChipBar<T> instance={instance} />
      {(showGlobalFilter || props.children) && (
        <Box {...childProps}>
          <Stack direction="row" spacing={3}>
            {showGlobalFilter && (
              <DefaultGlobalFilter<T>
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
            )}
            {props.children}
          </Stack>
        </Box>
      )}
      <StyledTable {...tableProps}>
        <TableHead>
          {headerGroups.map((headerGroup) => {
            const {
              key: headerGroupKey,
              role: headerGroupRole,
              ...headerGroupProps
            } = headerGroup.getHeaderGroupProps()
            return (
              <TableHeadRow key={headerGroupKey} {...headerGroupProps}>
                {headerGroup.headers.map((column) => {
                  const style = {
                    textAlign: column.align ? column.align : 'left',
                  } as CSSProperties
                  const {
                    key: headerKey,
                    role: headerRole,
                    ...headerProps
                  } = column.getHeaderProps(columnStyle)
                  const { title: sortTitle = '', ...columnSortByProps } =
                    column.getSortByToggleProps()
                  const { title: groupTitle = '', ...columnGroupByProps } =
                    column.getGroupByToggleProps()
                  return (
                    <TableHeadCell key={headerKey} {...headerProps}>
                      {column.canGroupBy && (
                        <Tooltip title={groupTitle}>
                          <TableSortLabel
                            active
                            direction={column.isGrouped ? 'desc' : 'asc'}
                            IconComponent={KeyboardArrowRight}
                            {...columnGroupByProps}
                            sx={{
                              '& svg': {
                                width: 16,
                                height: 16,
                                marginTop: 1,
                                marginRight: 0,
                              },
                            }}
                          />
                        </Tooltip>
                      )}
                      {column.canSort && !hideSort ? (
                        <Tooltip title={sortTitle}>
                          <TableSortLabel
                            active={column.isSorted}
                            direction={column.isSortedDesc ? 'desc' : 'asc'}
                            {...columnSortByProps}
                            style={style}
                            sx={{
                              '& svg': {
                                width: 16,
                                height: 16,
                                marginTop: 0,
                                marginLeft: 0.5,
                              },
                            }}
                          >
                            {column.render('Header')}
                          </TableSortLabel>
                        </Tooltip>
                      ) : (
                        <TableLabel style={style}>
                          {column.render('Header')}
                        </TableLabel>
                      )}
                      {column.canResize && (
                        <ColumnResizeHandle column={column} />
                      )}
                    </TableHeadCell>
                  )
                })}
              </TableHeadRow>
            )
          })}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {headerGroups.map((headerGroup) => {
            const {
              key: headerGroupKey,
              role: headerGroupRole,
              ...headerGroupProps
            } = headerGroup.getHeaderGroupProps()
            return (
              <TableRow key={headerGroupKey} {...headerGroupProps}>
                <>
                  {headerGroup.headers.map((column) => {
                    const {
                      key: headerKey,
                      role: headerRole,
                      ...headerProps
                    } = column.getHeaderProps(columnStyle)
                    return (
                      <TableHeadCell key={headerKey} {...headerProps}>
                        {column.canFilter && <InlineFilter column={column} />}
                      </TableHeadCell>
                    )
                  })}
                </>
              </TableRow>
            )
          })}
          {page.map((row) => {
            prepareRow(row)
            const {
              key: rowKey,
              role: rowRole,
              ...rowProps
            } = row.getRowProps()

            return (
              <TableRow key={rowKey} {...rowProps}>
                {row.cells.map((cell) => {
                  const {
                    key: cellKey,
                    role: cellRole,
                    ...cellProps
                  } = cell.getCellProps(columnStyle)
                  return (
                    <TableCell key={cellKey} {...cellProps}>
                      {cell.isGrouped ? (
                        <>
                          <TableSortLabel
                            active
                            direction={row.isExpanded ? 'desc' : 'asc'}
                            IconComponent={KeyboardArrowUp}
                            {...row.getToggleRowExpandedProps()}
                          />{' '}
                          {cell.render('Cell', { editable: false })} (
                          {row.subRows.length})
                        </>
                      ) : cell.isAggregated ? (
                        cell.render('Aggregated')
                      ) : cell.isPlaceholder ? null : (
                        cell.render('Cell')
                      )}
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </StyledTable>
      {hidePagination ? null : (
        <TablePagination maxRows={props.maxrows} instance={instance} />
      )}
    </>
  )
}

export { Table }
