import { useCallback } from 'react'
import { TableInstance } from 'react-table'
import { TableData } from '../Table'
import { MouseEvent as ReactMouseEvent } from 'react'
import { TablePagination as MuiTablePagination } from '@mui/material'
import TablePaginationActions from './TablePaginationActions'

interface PaginationProps<T extends TableData> {
  instance: TableInstance<T>
}

const TablePagination = <T extends TableData>({
  instance,
}: PaginationProps<T>) => {
  const {
    state: { pageIndex, pageSize, rowCount = instance.rows.length },
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
  } = instance
  const rowsPerPageOptions = [5, 10, 25, { value: rowCount, label: 'All' }]

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
    },
    [gotoPage, nextPage, pageIndex, previousPage],
  )

  const onChangeRowsPerPage = useCallback(
    (event) => {
      setPageSize(Number(event.target.value))
    },
    [setPageSize],
  )

  return rowCount ? (
    <MuiTablePagination
      rowsPerPageOptions={rowsPerPageOptions}
      component="div"
      count={rowCount}
      rowsPerPage={pageSize}
      page={pageIndex}
      SelectProps={{
        inputProps: { 'aria-label': 'rows per page' },
      }}
      onPageChange={handleChangePage}
      onRowsPerPageChange={onChangeRowsPerPage}
      ActionsComponent={TablePaginationActions}
    />
  ) : null
}

export { TablePagination }
