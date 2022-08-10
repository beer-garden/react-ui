import { TablePagination as MuiTablePagination } from '@mui/material'
import { TableData } from 'components/Table'
import SSRTablePaginationActions from 'components/Table/ssr-pagination/SSRTablePaginationActions'
import { MouseEvent as ReactMouseEvent, useCallback } from 'react'
import { TableInstance } from 'react-table'
import { getRowPageOptions } from 'utils/table-helpers'

interface SSRPaginationProps<T extends TableData> {
  instance: TableInstance<T>
  recordsFiltered: number
  recordsTotal: number
  handleStartPage: (page: number) => void
  handleResultCount: (resultCount: number) => void
}

const SSRTablePagination = <T extends TableData>({
  instance,
  recordsFiltered,
  recordsTotal,
  handleStartPage,
  handleResultCount,
}: SSRPaginationProps<T>) => {
  const {
    state: { pageIndex, pageSize, rowCount = instance.rows.length },
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
  } = instance

  const rowMax = instance.rows.length <= 100 ? instance.rows.length : 100
  const rowsPerPageOptions = getRowPageOptions(rowMax, instance.rows.length)

  const handleChangePage = useCallback(
    (
      event: ReactMouseEvent<HTMLButtonElement, MouseEvent> | null,
      newPage: number,
    ) => {
      if (newPage === pageIndex + 1) {
        nextPage()
      } else if (newPage === pageIndex - 1) {
        previousPage()
      } else {
        gotoPage(newPage)
      }
      handleStartPage(newPage)
    },
    [gotoPage, nextPage, pageIndex, previousPage, handleStartPage],
  )

  const onChangeRowsPerPage = useCallback(
    (event) => {
      const pageSize = Number(event.target.value)
      handleResultCount(pageSize)
      setPageSize(pageSize)
      gotoPage(0)
    },
    [setPageSize, handleResultCount, gotoPage],
  )

  const displayRows = (arg: { from: number; to: number; count: number }) => {
    const { from, to, count } = arg
    if (count === recordsTotal) {
      return `Displaying ${from}–${to} of ${count}`
    } else {
      return `Displaying ${from}-${to} of ${count} \
      (filtered from ${recordsTotal})`
    }
  }

  return rowCount ? (
    <MuiTablePagination
      rowsPerPageOptions={rowsPerPageOptions}
      component="div"
      count={recordsFiltered}
      rowsPerPage={pageSize}
      page={pageIndex}
      SelectProps={{
        inputProps: { 'aria-label': 'rows per page' },
      }}
      onPageChange={handleChangePage}
      onRowsPerPageChange={onChangeRowsPerPage}
      ActionsComponent={SSRTablePaginationActions}
      labelDisplayedRows={displayRows}
    />
  ) : null
}

export { SSRTablePagination }
