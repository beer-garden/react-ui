import { Box, Button, Popover, Typography } from '@mui/material'
import { TableData } from 'components/Table'
import { FormEvent as ReactFormEvent, useCallback } from 'react'
import { ColumnInstance, TableInstance } from 'react-table'

const filterSorter = <T extends TableData>(
  x: ColumnInstance<T>,
  y: ColumnInstance<T>,
) => {
  if (x.filterOrder && y.filterOrder) return x.filterOrder - y.filterOrder
  else return 0
}

interface FilterPageProps<T extends TableData> {
  instance: TableInstance<T>
  anchorEl?: Element
  onClose: VoidFunction
  show: boolean
}

const FilterPage = <T extends TableData>({
  instance,
  anchorEl,
  onClose,
  show,
}: FilterPageProps<T>) => {
  const { allColumns, setAllFilters } = instance

  const onSubmit = useCallback(
    (event: ReactFormEvent<HTMLFormElement>) => {
      event.preventDefault()
      onClose()
    },
    [onClose],
  )

  const resetFilters = useCallback(() => {
    setAllFilters([])
  }, [setAllFilters])

  return (
    <Box>
      <Popover
        anchorEl={anchorEl}
        id="popover-filters"
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
      >
        <Box sx={{ padding: 2 }}>
          <Typography
            sx={{
              fontWeight: 500,
              padding: '0 24px 24px 0',
              textTransform: 'uppercase',
            }}
          >
            Filters
          </Typography>
          <form onSubmit={onSubmit}>
            <Button
              color="primary"
              onClick={resetFilters}
              sx={{ position: 'absolute', top: 18, right: 21 }}
            >
              Reset
            </Button>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 265px)',
                '@media (max-width: 600px)': {
                  gridTemplateColumns: 'repeat(1, 180px)',
                },
                gridColumnGap: 36,
                gridRowGap: 24,
              }}
            >
              {allColumns
                .filter((it) => it.canFilter)
                .slice()
                .sort(filterSorter)
                .map((column) =>
                  column.isWide ? (
                    <Box
                      key={column.id}
                      sx={{
                        display: 'grid',
                        gridColumn: '1 / span 2',
                        gridTemplateColumns: 'subgrid',
                      }}
                    >
                      {column.render('Filter')}
                    </Box>
                  ) : (
                    <Box
                      key={column.id}
                      sx={{
                        width: '100%',
                        display: 'inline-flex',
                        flexDirection: 'column',
                      }}
                    >
                      {column.render('Filter')}
                    </Box>
                  ),
                )}
            </Box>
            <Button type="submit" sx={{ display: 'none' }}>
              &nbsp;
            </Button>
          </form>
        </Box>
      </Popover>
    </Box>
  )
}

export { FilterPage }
