import { TablePagination as MuiTablePagination } from '@mui/material'
import TablePaginationActions from 'components/Table/pagination/TablePaginationActions'
import { useCallback } from 'react'
import { MouseEvent as ReactMouseEvent, useEffect } from 'react'
import { TableInstance } from 'react-table'
import { ObjectWithStringKeys } from 'types/custom-types'
import { getRowPageOptions } from 'utils/table-helpers'

interface PaginationProps<T extends ObjectWithStringKeys> {
  instance: TableInstance<T>
  maxRows?: number
}

const TablePagination = <T extends ObjectWithStringKeys>({
  instance,
  maxRows,
}: PaginationProps<T>) => {
  const {
    state: { pageIndex, pageSize, rowCount = instance.rows.length },
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
  } = instance

  const rowsPerPageOptions = getRowPageOptions(
    maxRows || instance.rows.length,
    instance.rows.length,
  )

  useEffect(() => {
    const maxVal = rowsPerPageOptions[rowsPerPageOptions.length - 1] as {
      value: number
      label: string
    }
    if (maxVal && pageSize > maxVal.value) {
      setPageSize(maxVal.value)
    }
  }, [pageSize, rowsPerPageOptions, setPageSize])

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
