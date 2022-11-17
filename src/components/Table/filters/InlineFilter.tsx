import { Box } from '@mui/material'
import { ColumnInstance } from 'react-table'
import { ObjectWithStringKeys } from 'types/custom-types'

interface FilterPageProps<T extends ObjectWithStringKeys> {
  column: ColumnInstance<T>
}

const InlineFilter = <T extends ObjectWithStringKeys>({
  column,
}: FilterPageProps<T>) => {
  return (
    <>
      {column.isWide ? (
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
            width: '95%',
            display: 'inline-flex',
            flexDirection: 'column',
          }}
        >
          {column.render('Filter')}
        </Box>
      )}
    </>
  )
}

export { InlineFilter }
