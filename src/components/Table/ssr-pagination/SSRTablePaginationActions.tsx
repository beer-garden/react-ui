import FirstPageIcon from '@mui/icons-material/FirstPage'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import LastPageIcon from '@mui/icons-material/LastPage'
import { Box, IconButton } from '@mui/material'
import { useTheme } from '@mui/material/styles'
// eslint-disable-next-line no-restricted-imports
import { TablePaginationActionsProps as MuiTablePaginationActionsProps } from '@mui/material/TablePagination/TablePaginationActions'
import { ElementType, MouseEvent as ReactMouseEvent, useCallback } from 'react'

interface SSRTablePaginationActionsProps
  extends MuiTablePaginationActionsProps {
  count: number
  page: number
  rowsPerPage: number
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    page: number,
  ) => void
}

const SSRTablePaginationActions: ElementType<
  SSRTablePaginationActionsProps
> = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
}: SSRTablePaginationActionsProps) => {
  const theme = useTheme()

  const handleFirstpageButtonClick = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement>) => {
      onPageChange(event, 0)
    },
    [onPageChange],
  )

  const handleBackButtonClick = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement>) => {
      onPageChange(event, page - 1)
    },
    [onPageChange, page],
  )

  const handleNextButtonClick = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement>) => {
      onPageChange(event, page + 1)
    },
    [onPageChange, page],
  )

  const handleLastPageButtonClick = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement>) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
    },
    [onPageChange, count, rowsPerPage],
  )

  return (
    <Box sx={{ flexShrink: 0, marginLeft: theme.spacing(2.5) }}>
      <IconButton
        onClick={handleFirstpageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        <KeyboardArrowLeftIcon />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        <KeyboardArrowRightIcon />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        <LastPageIcon />
      </IconButton>
    </Box>
  )
}

export default SSRTablePaginationActions
