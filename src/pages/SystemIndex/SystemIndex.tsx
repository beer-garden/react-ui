import { Box } from '@mui/material'
import { SystemIndexTable } from 'pages/SystemIndex/SystemIndexTable'

const SystemsIndex = () => {
  return (
    <Box>
      <Box pt={1}>
        <SystemIndexTable />
      </Box>
    </Box>
  )
}

export { SystemsIndex }
