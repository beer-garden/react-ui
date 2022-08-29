import { Box } from '@mui/material'
import { CellProps } from 'react-table'
import { ObjectWithStringKeys } from 'types/custom-types'

const DefaultCellRenderer = ({
  cell: { value },
}: CellProps<ObjectWithStringKeys>) => (
  <Box component="span" display="flex" justifyContent="left">
    {value}
  </Box>
)

export { DefaultCellRenderer }
