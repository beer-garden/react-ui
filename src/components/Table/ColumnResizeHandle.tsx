import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { TableData } from 'components/Table'
import { ColumnInstance } from 'react-table'

interface ColumnResizeHandleProps<T extends TableData> {
  column: ColumnInstance<T>
}

const ColumnResizeHandle = <T extends TableData>({
  column,
}: ColumnResizeHandleProps<T>) => {
  const theme = useTheme()

  return (
    <Box
      {...column.getResizerProps()}
      style={{ cursor: 'col-resize' }}
      sx={{
        position: 'absolute',
        cursor: 'col-resize',
        zIndex: 100,
        opacity: 0,
        borderLeft: `1px solid ${theme.palette.primary.light}`,
        borderRight: `1px solid ${theme.palette.primary.light}`,
        height: '50%',
        top: '50%',
        transition: 'all linear 100ms',
        right: -2,
        width: 3,
        '%.handleActive': {
          opacity: 1,
          border: 'none',
          backgroundColor: theme.palette.primary.light,
          height: 'calc(100% - 4px)',
          top: '2px',
          right: -1,
          width: 1,
        },
      }}
    />
  )
}

export { ColumnResizeHandle }
