import { KeyboardArrowUp } from '@mui/icons-material'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import {
  Box,
  CircularProgress,
  TableSortLabel,
  Tooltip,
  Typography,
} from '@mui/material'
import type { TableData } from 'components/Table'
import { ColumnResizeHandle, FilterChipBar, Toolbar } from 'components/Table'
import { fuzzyTextFilter, numericTextFilter } from 'components/Table/filters'
import {
  DefaultCellRenderer,
  DefaultColumnFilter,
  defaultColumnValues,
  DefaultHeader,
} from 'components/Table/defaults'
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
  Fragment,
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

const filterTypes = {
  fuzzyText: fuzzyTextFilter,
  numeric: numericTextFilter,
}

const defaultColumn = {
  Filter: DefaultColumnFilter,
  Cell: DefaultCellRenderer,
  Header: DefaultHeader,
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

interface TableProps<T extends TableData, R extends string, S extends string>
  extends TableOptions<T> {
  tableName: string
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
}

const SSRTable = <T extends TableData, R extends string, S extends string>(
  props: PropsWithChildren<TableProps<T, R, S>>,
): ReactElement => {
  const {
    tableName,
    data,
    columns,
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
    `tableState:${tableName}`,
    {} as Partial<TableState<T>>,
  )

  const pageCount = useMemo(
    () => (requested ? Math.ceil(recordsFiltered / requested) : 0),
    [requested, recordsFiltered],
  )

  const instance = useTable<T>(
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
  } = instance

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

    setInitialState({
      sortBy: ordering ? [ordering] : sortBy,
      filters,
      pageSize: requested || 10,
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
  ])

  /**
   * Fetch new data when the table filters are updated.
   */
  useEffect(() => {
    if (!deeplyEqual(debouncedState.filters, filterList)) {
      gotoPage(0)
      handleSearchBy(debouncedState.filters)
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

  const { role: tableRole, ...tableProps } = getTableProps()

  return isErrored ? (
    <Typography>Error...</Typography>
  ) : (
    <Fragment>
      <Toolbar name={tableName} instance={instance} />
      <FilterChipBar<T> instance={instance} />

      <Box {...childProps}>{props.children}</Box>

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
                  } = column.getHeaderProps()
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
                <CircularProgress />
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody {...getTableBodyProps()}>
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
                    } = cell.getCellProps()
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
        instance={instance}
        recordsFiltered={recordsFiltered}
        recordsTotal={recordsTotal}
        handleStartPage={handleStartPage}
        handleResultCount={handleResultCount}
      />
    </Fragment>
  )
}

export { SSRTable }
