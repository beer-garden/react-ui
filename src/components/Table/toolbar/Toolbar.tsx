import FilterListIcon from '@mui/icons-material/FilterList'
import ViewColumnIcon from '@mui/icons-material/ViewColumn'
import {
  Box,
  Divider,
  IconButton,
  Toolbar as MuiToolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import { TableData } from 'components/Table'
import { ColumnHidePage } from 'components/Table/toolbar/ColumnHidePage'
import { FilterPage } from 'components/Table/toolbar/FilterPage'
import {
  Fragment,
  MouseEvent as ReactMouseEvent,
  MouseEventHandler,
  ReactElement,
  useCallback,
  useState,
} from 'react'
import { ColumnInstance, TableInstance } from 'react-table'

interface ToolbarProps<T extends TableData> {
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

const getHideableColumns = <T extends TableData>(
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

const getFilterableColumns = <T extends TableData>(
  columns: ColumnInstance<T>[],
): ColumnInstance<T>[] => {
  if (columns.length) {
    const filterableColumns = columns.filter((column) => column.canFilter)

    const filterableSubColumns = columns.map((column) => {
      if (column.columns) {
        return column.columns.filter((column) => column.canFilter)
      }
      return []
    })

    return filterableColumns.concat(filterableSubColumns.flat())
  }

  return columns
}

const Toolbar = <T extends TableData>({ name, instance }: ToolbarProps<T>) => {
  const { columns } = instance
  const [anchorEl, setAnchorEl] = useState<Element | undefined>(undefined)
  const [columnsOpen, setColumnsOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const hideableColumns = getHideableColumns(columns)
  const filterableColumns = getFilterableColumns(columns)

  const handleColumnsClick = useCallback(
    (event: ReactMouseEvent) => {
      setAnchorEl(event.currentTarget)
      setColumnsOpen(true)
    },
    [setAnchorEl, setColumnsOpen],
  )

  const handleFilterClick = useCallback(
    (event: ReactMouseEvent) => {
      setAnchorEl(event.currentTarget)
      setFilterOpen(true)
    },
    [setAnchorEl, setFilterOpen],
  )

  const handleClose = useCallback(() => {
    setColumnsOpen(false)
    setFilterOpen(false)
    setAnchorEl(undefined)
  }, [])

  return (
    <Fragment>
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
          <FilterPage
            instance={instance}
            onClose={handleClose}
            show={filterOpen}
            anchorEl={anchorEl}
          />
          {hideableColumns.length > 1 && (
            <SmallIconActionButton
              icon={<ViewColumnIcon />}
              onClick={handleColumnsClick}
              label="Show / hide columns"
            />
          )}
          {filterableColumns.length > 0 && (
            <SmallIconActionButton
              icon={<FilterListIcon />}
              onClick={handleFilterClick}
              label="Filter by columns"
            />
          )}
        </Box>
      </MuiToolbar>
      <Divider />
    </Fragment>
  )
}

export { Toolbar }
