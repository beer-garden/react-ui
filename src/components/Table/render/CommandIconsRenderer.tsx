import FileUploadIcon from '@mui/icons-material/FileUpload'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { Box, Tooltip, Typography } from '@mui/material'
import OverflowTooltip from 'components/OverflowTooltip'
import { Link } from 'react-router-dom'
import { CellProps } from 'react-table'
import { ObjectWithStringKeys } from 'types/custom-types'

const CommandIconsRenderer = ({ cell }: CellProps<ObjectWithStringKeys>) => {
  const hasParent = cell.row.original.hasParent
  const isHidden = cell.row.original.isHidden
  const id = cell.row.original.id
  /* place an icon at the beginning for parent */
  /* place an icon at the end for visibility */
  return (
    <Box component="span" display="flex" justifyContent="space-between">
      {hasParent ? (
        <Link to={`/requests/${cell.row.original.parentId}`}>
          <Tooltip
            title={
              <>
                <Typography color="inherit">Link to parent</Typography>
                <em>{cell.row.original.parentCommand}</em>
              </>
            }
            aria-label="link to parent command"
          >
            <FileUploadIcon fontSize="small" sx={{ mr: 0.5 }} />
          </Tooltip>
        </Link>
      ) : null}
      <OverflowTooltip
        variant="inherit"
        tooltip={cell.value || ''}
        text={cell.value || ''}
        css={{ py: 0 }}
        link={`/requests/${id}`}
      />
      {isHidden ? (
        <Tooltip title="hidden command" aria-label="hidden command">
          <VisibilityOffIcon color="disabled" fontSize="small" sx={{ ml: 1 }} />
        </Tooltip>
      ) : null}
    </Box>
  )
}

export default CommandIconsRenderer
