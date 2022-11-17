import ViewColumnIcon from '@mui/icons-material/ViewColumn'
import {
  Box,
  Divider,
  IconButton,
  Toolbar as MuiToolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import { ColumnHidePage } from 'components/Table/toolbar/ColumnHidePage'
import {
  MouseEvent as ReactMouseEvent,
  MouseEventHandler,
  ReactElement,
  useCallback,
  useState,
} from 'react'
import { ColumnInstance, TableInstance } from 'react-table'
import { ObjectWithStringKeys } from 'types/custom-types'

interface ToolbarProps<T extends ObjectWithStringKeys> {
  name: string
  instance: TableInstance<T>
}

type ActionButtonProps = {
  icon?: JSX.Element
  onClick: MouseEventHandler
  enabled?: boolean
  label: string
  variant?: 'right' | 'left'
}

const SmallIconActionButton = ({
  icon,
  onClick,
  label,
  enabled = true,
}: ActionButtonProps): ReactElement => {
  return (
    <Tooltip title={label} aria-label={label}>
      <span>
        <IconButton
          onClick={onClick}
          disabled={!enabled}
          sx={{
            padding: 1,
            marginTop: '-6px',
            width: 48,
            height: 48,
            '&:last-of-type': {
              marginRight: -12,
            },
          }}
        >
          {icon}
        </IconButton>
      </span>
    </Tooltip>
  )
}

const getHideableColumns = <T extends ObjectWithStringKeys>(
  columns: ColumnInstance<T>[],
): ColumnInstance<T>[] => {
  if (columns.length) {
    const hideableColumns = columns.filter((column) => column.canHide)

    const hideableSubColumns = columns.map((column) => {
      if (column.columns) {
        return column.columns.filter((column) => column.canHide)
      }
      return []
    })

    return hideableColumns.concat(hideableSubColumns.flat())
  }

  return columns
}

const Toolbar = <T extends ObjectWithStringKeys>({
  name,
  instance,
}: ToolbarProps<T>) => {
  const { columns } = instance
  const [anchorEl, setAnchorEl] = useState<Element | undefined>(undefined)
  const [columnsOpen, setColumnsOpen] = useState(false)
  const hideableColumns = getHideableColumns(columns)

  const handleColumnsClick = useCallback(
    (event: ReactMouseEvent) => {
      setAnchorEl(event.currentTarget)
      setColumnsOpen(true)
    },
    [setAnchorEl, setColumnsOpen],
  )

  const handleClose = useCallback(() => {
    setColumnsOpen(false)
    setAnchorEl(undefined)
  }, [])

  return (
    <>
      <MuiToolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box ml={-3}>
          <Typography variant="h4">{name}</Typography>
        </Box>
        <Box>
          <ColumnHidePage
            instance={instance}
            onClose={handleClose}
            show={columnsOpen}
            anchorEl={anchorEl}
          />
          {hideableColumns.length > 1 && (
            <SmallIconActionButton
              icon={<ViewColumnIcon />}
              onClick={handleColumnsClick}
              label="Show / hide columns"
            />
          )}
        </Box>
      </MuiToolbar>
      <Divider />
    </>
  )
}

export { Toolbar }
