import { Box } from '@mui/material'
import { TableData } from 'components/Table'
import { CellProps } from 'react-table'

const DefaultCellRenderer = ({ cell: { value } }: CellProps<TableData>) => (
  <Box component="span" display="flex" justifyContent="left">
    {value}
  </Box>
)

export { DefaultCellRenderer }
