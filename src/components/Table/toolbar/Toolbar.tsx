import ViewColumnIcon from '@mui/icons-material/ViewColumn'
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { FilterChipBar } from 'components/Table'
import { DefaultGlobalFilter } from 'components/Table/defaults'
import { ColumnHidePage } from 'components/Table/toolbar/ColumnHidePage'
import {
  MouseEvent as ReactMouseEvent,
  MouseEventHandler,
  ReactElement,
  ReactNode,
  useCallback,
  useState,
} from 'react'
import { ColumnInstance, TableInstance } from 'react-table'
import { ObjectWithStringKeys } from 'types/custom-types'

interface ToolbarProps<T extends ObjectWithStringKeys> {
  name?: string
  instance: TableInstance<T>
  showGlobalFilter?: boolean
  children: ReactNode
  childProps: ObjectWithStringKeys
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
  showGlobalFilter,
  children,
  childProps,
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
      {name && <Typography variant="h4">{name}</Typography>}
      <FilterChipBar<T> instance={instance} />
      <Box
        {...childProps}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack direction="row" spacing={3}>
          {showGlobalFilter && (
            <DefaultGlobalFilter<T>
              preGlobalFilteredRows={instance.preGlobalFilteredRows}
              globalFilter={instance.state.globalFilter}
              setGlobalFilter={instance.setGlobalFilter}
            />
          )}
          {children}
        </Stack>
        {hideableColumns.length > 1 && (
          <SmallIconActionButton
            icon={<ViewColumnIcon />}
            onClick={handleColumnsClick}
            label="Show / hide columns"
          />
        )}
      </Box>
      <ColumnHidePage
        instance={instance}
        onClose={handleClose}
        show={columnsOpen}
        anchorEl={anchorEl}
      />
    </>
  )
}

export { Toolbar }
