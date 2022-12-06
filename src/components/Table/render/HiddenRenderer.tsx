import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { Box, Tooltip } from '@mui/material'
import OverflowTooltip from 'components/OverflowTooltip'
import { CellProps } from 'react-table'
import { ObjectWithStringKeys } from 'types/custom-types'

const HiddenRenderer = ({ cell }: CellProps<ObjectWithStringKeys>) => {
  /* place an icon at the end for visibility */
  return (
    <Box component="span" display="flex" justifyContent="space-between">
      <OverflowTooltip
        variant="inherit"
        tooltip={cell.value || ''}
        text={cell.value || ''}
        css={{ py: 0 }}
        link={undefined}
      />
      {cell.row.original.isHidden ? (
        <Tooltip title="hidden command" aria-label="hidden command">
          <VisibilityOffIcon color="disabled" fontSize="small" sx={{ ml: 1 }} />
        </Tooltip>
      ) : null}
    </Box>
  )
}

export default HiddenRenderer
