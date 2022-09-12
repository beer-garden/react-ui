import {
  AppBar,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  Toolbar,
  Typography,
} from '@mui/material'
import Table from 'components/table'
import { Garden } from 'types/backend-types'
import { TableState } from 'types/custom-types'

interface GardenInfoCardProps {
  garden: Garden
}

const GardenInfoCard = ({ garden }: GardenInfoCardProps) => {
  function getNamespaceList(garden: Garden) {
    return (
      <List
        sx={{
          width: '100%',
          maxHeight: 400,
          maxWidth: 300,
          p: 0,
        }}
      >
        {garden.namespaces.map((namespace: string) => (
          <ListItem key={namespace} disableGutters disablePadding dense>
            {'\u25CF'} {namespace}
          </ListItem>
        ))}
      </List>
    )
  }

  function getTableData() {
    return [
      ['Name', garden.name],
      ['Status', garden.status],
      ['Known Namespaces', getNamespaceList(garden)],
      ['Systems', garden.systems.length],
    ]
  }

  const state: TableState = {
    formatData: getTableData,
    tableHeads: [],
    includePageNav: false,
    disableSearch: true,
  }

  return (
    <Box width={1 / 3} pb={1}>
      <Card sx={{ minWidth: 275 }}>
        <AppBar color="inherit" position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit">
              Garden Info
            </Typography>
          </Toolbar>
        </AppBar>
        <CardContent>
          <Table parentState={state} />
        </CardContent>
      </Card>
    </Box>
  )
}

export default GardenInfoCard
