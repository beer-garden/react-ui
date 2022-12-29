import { KeyboardArrowUp } from '@mui/icons-material'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import {
  CircularProgress,
  TableSortLabel,
  Tooltip,
  Typography,
} from '@mui/material'
import { ColumnResizeHandle, Toolbar } from 'components/Table'
import { defaultColumnValues, DefaultHeader } from 'components/Table/defaults'
import {
  fuzzyTextFilter,
  InlineFilter,
  numericTextFilter,
  TextFilter,
} from 'components/Table/filters'
import { OverflowCellRenderer } from 'components/Table/render'
import { SSRTablePagination } from 'components/Table/ssr-pagination'
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
  PropsWithChildren,
  ReactElement,
  useEffect,
  useMemo,
} from 'react'
import deeplyEqual from 'react-fast-compare'
import {
  Column,
  Filters,
  SortingRule,
  TableOptions,
  TableState,
  useColumnOrder,
  useExpanded,
  useFilters,
  useFlexLayout,
  useGroupBy,
  usePagination,
  useResizeColumns,
  useRowSelect,
  useSortBy,
  useTable,
} from 'react-table'
import type { ObjectWithStringKeys } from 'types/custom-types'

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
  useSortBy,
  useExpanded,
  useFlexLayout,
  usePagination,
  useResizeColumns,
  useRowSelect,
]

interface TableProps<
  T extends ObjectWithStringKeys,
  R extends string,
  S extends string,
> extends TableOptions<T> {
  data: T[]
  columns: Column<T>[]
  fetchStatus: { isLoading: boolean; isErrored: boolean }
  ssrValues: {
    start: number
    requested: number
    recordsFiltered: number
    recordsTotal: number
  }
  sortAndOrdering: {
    filterList?: Filters<T>
    ordering?: SortingRule<T>
    defaultOrderingColumnIndex?: number
  }
  handlers: {
    handleSearchBy: (searchFilters: Filters<T>) => void
    handleOrderBy: (column: R, direction: S) => void
    handleResultCount: (resultCount: number) => void
    handleStartPage: (page: number) => void
  }
  tableName?: string
  tableKey?: string
  showGlobalFilter?: boolean
}

const SSRTable = <
  T extends ObjectWithStringKeys,
  R extends string,
  S extends string,
>(
  props: PropsWithChildren<TableProps<T, R, S>>,
): ReactElement => {
  const {
    tableName,
    tableKey,
    data,
    columns,
    showGlobalFilter,
    fetchStatus: { isLoading, isErrored },
    ssrValues: {
      start: startPage /* the start page index */,
      requested /* the # of records per page we asked for */,
      recordsFiltered /* total # of records that could be returned */,
      recordsTotal /* # of records that would be returned if unfiltered */,
    },
    sortAndOrdering: { filterList, ordering, defaultOrderingColumnIndex },
    handlers: {
      handleSearchBy,
      handleOrderBy,
      handleResultCount,
      handleStartPage,
    },
    ...childProps
  } = props

  const [initialState, setInitialState] = useLocalStorage(
    `tableState:${tableKey || tableName}`,
    {} as Partial<TableState<T>>,
  )

  const pageCount = useMemo(() => {
    return requested > 0
      ? Math.ceil(recordsFiltered / requested)
      : initialState.pageSize
      ? Math.ceil(recordsFiltered / initialState.pageSize)
      : 0
  }, [initialState.pageSize, recordsFiltered, requested])

  const tableInstance = useTable<T>(
    {
      data,
      columns,
      filterTypes,
      defaultColumn,
      initialState,
      disableSortRemove: true,
      manualPagination: true,
      autoResetPage: false,
      manualFilters: true,
      manualSortBy: true,
      autoResetSortBy: false,
      pageCount,
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
    setSortBy,
    gotoPage,
  } = tableInstance

  /* debounce the state so it can't update too quickly */
  const debouncedState = useDebounce<TableState<T>>(state, 500)

  /**
   * Establish the initial state for the useTable call.
   */
  useEffect(() => {
    const { filters, hiddenColumns } = debouncedState
    let { sortBy } = debouncedState

    if (sortBy.length === 0 && columns && columns.length) {
      if (
        defaultOrderingColumnIndex &&
        defaultOrderingColumnIndex < columns.length
      ) {
        const targetColumn = columns[defaultOrderingColumnIndex]

        if (targetColumn.accessor) {
          const accessor = targetColumn.accessor

          if (typeof accessor === 'string') {
            sortBy = [{ id: accessor, desc: true } as SortingRule<T>]

            /**
             *  in this case, the source of truth is the backend, so we set the
             *  table state to match
             */
            setSortBy(sortBy)
          }
        }
      }
    }
    const pageSize = debouncedState.pageSize
      ? debouncedState.pageSize
      : requested > 0
      ? requested
      : initialState.pageSize
      ? initialState.pageSize
      : 10
    setInitialState({
      sortBy: ordering ? [ordering] : sortBy,
      filters,
      pageSize,
      pageIndex: startPage || 0,
      hiddenColumns,
    })
  }, [
    columns,
    debouncedState,
    requested,
    setInitialState,
    startPage,
    defaultOrderingColumnIndex,
    setSortBy,
    ordering,
    initialState.pageSize,
  ])

  /**
   * Fetch new data when the table filters are updated.
   */
  useEffect(() => {
    if (!deeplyEqual(debouncedState.filters, filterList)) {
      handleSearchBy(debouncedState.filters)
      gotoPage(0)
    }
  }, [
    debouncedState.filters,
    filterList,
    handleSearchBy,
    handleStartPage,
    gotoPage,
  ])

  /**
   * Fetch new data when the table ordering changes.
   */
  useEffect(() => {
    if (debouncedState.sortBy && debouncedState.sortBy.length) {
      const tableSortBy = debouncedState.sortBy.slice().pop() as SortingRule<T>
      const id = tableSortBy.id as R

      if (!deeplyEqual(tableSortBy, ordering)) {
        handleOrderBy(id, tableSortBy.desc ? ('desc' as S) : ('asc' as S))
      }
    }
  }, [handleOrderBy, debouncedState.sortBy, ordering])

  /**
   * Ensure the data on initial load is filtered and ordered according to the
   * values from local storage (which we access via the `debouncedState`
   * variable).
   */
  useEffect(() => {
    const tableSortBy = debouncedState.sortBy.slice().pop()
    if (tableSortBy) {
      handleOrderBy(
        tableSortBy.id as R,
        tableSortBy.desc ? ('desc' as S) : ('asc' as S),
      )
    }
    handleSearchBy(debouncedState.filters)
    gotoPage(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { role: tableRole, ...tableProps } = getTableProps()

  return isErrored ? (
    <Typography>Error...</Typography>
  ) : (
    <>
      <Toolbar
        instance={tableInstance}
        childProps={childProps}
        name={tableName}
      >
        {props.children}
      </Toolbar>
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
                  const {
                    title: sortTitle = '',
                    onClick: sortOnClick,
                    ...columnSortByProps
                  } = column.getSortByToggleProps()
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
                      {column.canSort ? (
                        <Tooltip title={sortTitle}>
                          <TableSortLabel
                            active={column.isSorted}
                            direction={column.isSortedDesc ? 'desc' : 'asc'}
                            onClick={(e) => {
                              if (column.canSort) {
                                const dir = !column.isSortedDesc
                                setSortBy([{ id: column.id, desc: dir }])
                                column.toggleSortBy(dir)
                              }
                            }}
                            {...columnSortByProps}
                            style={style}
                            hideSortIcon={false}
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
        {isLoading ? (
          <TableBody>
            <TableRow>
              <TableCell>
                <CircularProgress aria-label="Table data loading" />
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody {...getTableBodyProps()}>
            {/* Filter row */}
            {!showGlobalFilter
              ? headerGroups.map((headerGroup) => {
                  const {
                    key: headerGroupKey,
                    role: headerGroupRole,
                    ...headerGroupProps
                  } = headerGroup.getHeaderGroupProps()
                  return (
                    <TableRow
                      key={headerGroupKey + 'Filter'}
                      {...headerGroupProps}
                    >
                      <>
                        {headerGroup.headers.map((column) => {
                          const {
                            key: headerKey,
                            role: headerRole,
                            ...headerProps
                          } = column.getHeaderProps(columnStyle)
                          return (
                            <TableCell
                              key={headerKey + 'Filter'}
                              {...headerProps}
                            >
                              {column.canFilter && (
                                <InlineFilter column={column} />
                              )}
                            </TableCell>
                          )
                        })}
                      </>
                    </TableRow>
                  )
                })
              : null}
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
        )}
      </StyledTable>
      <SSRTablePagination
        instance={tableInstance}
        recordsFiltered={recordsFiltered}
        recordsTotal={recordsTotal}
        handleStartPage={handleStartPage}
        handleResultCount={handleResultCount}
      />
    </>
  )
}

export { SSRTable }
