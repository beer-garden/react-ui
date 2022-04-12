import {
  Box,
  Checkbox,
  FormControlLabel,
  Popover,
  Typography,
} from '@mui/material'
import { TableInstance } from 'react-table'
import { TableData } from '../Table'

interface ColumnHidePageProps<T extends TableData> {
  instance: TableInstance<T>
  anchorEl?: Element
  onClose: VoidFunction
  show: boolean
}

const id = 'popover-column-hide'

const ColumnHidePage = <T extends TableData>({
  instance,
  anchorEl,
  onClose,
  show,
}: ColumnHidePageProps<T>) => {
  const { allColumns, toggleHideColumn } = instance
  const hideableColumns = allColumns.filter((column) => column.canHide)
  const checkedCount = hideableColumns.reduce(
    (acc, val) => acc + (val.isVisible ? 0 : 1),
    0,
  )

  const onlyOneOptionLeft = checkedCount + 1 >= hideableColumns.length

  return hideableColumns.length > 1 ? (
    <div>
      <Popover
        anchorEl={anchorEl}
        id={id}
        onClose={onClose}
        open={show}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{ padding: 24 }}
      >
        <Box sx={{ padding: 2 }}>
          <Typography
            sx={{
              fontWeight: 500,
              padding: '0 24px 24px 0',
              textTransform: 'uppercase',
            }}
          >
            Visible Columns
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 198px)',
              '@media (max-width: 600px)': {
                gridTemplateColumns: 'repeat(1, 160px)',
              },
              gridColumnGap: 6,
              gridRowGap: 6,
            }}
          >
            {hideableColumns.map((column) => (
              <FormControlLabel
                key={column.id}
                control={
                  <Checkbox
                    value={`${column.id}`}
                    disabled={column.isVisible && onlyOneOptionLeft}
                  />
                }
                label={column.render('Header')}
                checked={column.isVisible}
                onChange={() => toggleHideColumn(column.id, column.isVisible)}
              />
            ))}
          </Box>
        </Box>
      </Popover>
    </div>
  ) : null
}

export default ColumnHidePage
