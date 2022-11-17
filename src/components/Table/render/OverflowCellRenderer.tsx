import { Box } from '@mui/material'
import OverflowTooltip from 'components/OverflowTooltip'
import { CellProps } from 'react-table'
import { ObjectWithStringKeys } from 'types/custom-types'

const OverflowCellRenderer = ({
  cell: { value },
}: CellProps<ObjectWithStringKeys>) => (
  <Box component="span" display="flex" justifyContent="left">
    <OverflowTooltip
      variant="inherit"
      tooltip={value || ''}
      text={value || ''}
      css={{ py: 0 }}
    />
  </Box>
)

export { OverflowCellRenderer }
