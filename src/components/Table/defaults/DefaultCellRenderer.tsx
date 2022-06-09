import { Box } from '@mui/material'
import { CellProps } from 'react-table'
import { TableData } from 'components/Table'

const DefaultCellRenderer = ({ cell: { value } }: CellProps<TableData>) => (
  <Box component="span" display="flex" justifyContent="left">
    {value}
  </Box>
)

export { DefaultCellRenderer }
