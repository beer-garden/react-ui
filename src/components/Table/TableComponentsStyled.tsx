import {
  Box,
  BoxProps,
  Table as MuiTable,
  TableBody as MuiTableBody,
  TableCell as MuiTableCell,
  TableCellProps,
  TableHead as MuiTableHead,
  TableRow as MuiTableRow,
  TableTypeMap,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { PropsWithChildren } from 'react'

type TableProps = Partial<TableTypeMap> &
  PropsWithChildren<Record<never, never>>

const Table = ({ children, ...rest }: TableProps) => {
  return (
    <MuiTable
      stickyHeader={true}
      {...rest}
      sx={{
        borderSpacing: 0,
        border: '1px solid rgba(224, 224, 224, 1)',
        width: '100%',
      }}
    >
      {children}
    </MuiTable>
  )
}

const TableHead = ({ children, ...rest }: TableProps) => {
  return <MuiTableHead {...rest}>{children}</MuiTableHead>
}

const TableHeadRow = ({ children, ...rest }: TableProps) => {
  const theme = useTheme()

  return (
    <MuiTableRow
      {...rest}
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderBottom: '1px solid rgba(224,224,224,1)',
        '&:hover $resizeHandle': {
          opacity: 1,
        },
      }}
    >
      {children}
    </MuiTableRow>
  )
}

const TableHeadCell = ({ children, ...rest }: TableProps) => {
  const theme = useTheme()

  return (
    <MuiTableCell
      {...rest}
      sx={{
        padding: '16px 1px 16px 16px',
        fontSize: '0.875rem',
        textAlign: 'left',
        verticalAlign: 'inherit',
        color: theme.palette.text.primary,
        fontWeigh: 500,
        lineHeight: '1.5rem',
        borderRight: '1px solid rgba(224, 224, 224, 1)',
        '&:last-child': {
          borderRight: 'none',
        },
      }}
    >
      {children}
    </MuiTableCell>
  )
}

const TableBody = ({ children, ...rest }: TableProps) => {
  return <MuiTableBody {...rest}>{children}</MuiTableBody>
}

const TableRow = ({ children, ...rest }: TableProps) => {
  return (
    <MuiTableRow
      {...rest}
      sx={{
        color: 'inherit',
        outline: 0,
        verticalAlign: 'middle',
        '&:hover': {
          backgroundColor: 'rgba(0,0,0, 0.07)',
        },
        borderBottom: '1px solid rgba(224, 224, 224, 1)',
        '&:last-child': {
          bottomBorder: 'none',
        },
        '&.clickable': {
          cursor: 'pointer',
        },
      }}
    >
      {children}
    </MuiTableRow>
  )
}

const TableCell = ({
  children,
  ...rest
}: TableProps & Partial<TableCellProps>) => {
  const theme = useTheme()

  return (
    <MuiTableCell
      {...rest}
      sx={{
        padding: '8px 16px',
        fontSize: '0.875rem',
        textAlign: 'left',
        fontWeight: 300,
        lineHeight: 1.3,
        verticalAlign: 'inherit',
        color: theme.palette.text.primary,
        borderRight: '1px solid rgba(224, 224, 224, 1)',
        '&:last-child': {
          borderRight: 'none',
        },
      }}
    >
      {children}
    </MuiTableCell>
  )
}

const TableLabel = ({ children, ...rest }: TableProps & BoxProps) => {
  return <Box {...rest}>{children}</Box>
}

export {
  Table,
  TableHead,
  TableHeadRow,
  TableHeadCell,
  TableBody,
  TableRow,
  TableCell,
  TableLabel,
}
