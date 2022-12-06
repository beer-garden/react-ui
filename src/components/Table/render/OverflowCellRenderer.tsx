import { Box } from '@mui/material'
import OverflowTooltip from 'components/OverflowTooltip'
import { CellProps } from 'react-table'
import { ObjectWithStringKeys } from 'types/custom-types'

const OverflowCellRenderer = ({ cell }: CellProps<ObjectWithStringKeys>) => {
  return (
    <Box component="span" display="flex" justifyContent="left">
      <OverflowTooltip
        variant="inherit"
        tooltip={cell.value || ''}
        text={cell.value || ''}
        css={{ py: 0 }}
        link={
          cell.column.linkKey
            ? (cell.row.original[cell.column.linkKey] as string)
            : undefined
        }
      />
    </Box>
  )
}

export { OverflowCellRenderer }
