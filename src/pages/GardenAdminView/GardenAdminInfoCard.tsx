import {
  AppBar,
  Box,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  Toolbar,
  Typography,
} from '@mui/material'
import { GardenStatusAlert } from 'components/GardenStatusAlert'
import { Garden } from 'types/backend-types'

interface GardenInfoCardProps {
  garden: Garden
}

const GardenAdminInfoCard = ({ garden }: GardenInfoCardProps) => {
  return (
    <Box width={1 / 3}>
      <Card sx={{ minWidth: 275 }}>
        <AppBar color="inherit" position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit">
              Garden Info
            </Typography>
          </Toolbar>
        </AppBar>
        <CardContent>
          Name: {garden.name}
          <Grid container>
            <Grid>
              <Box sx={{ mr: 1 }}>Status: </Box>
            </Grid>
            <Grid>
              <GardenStatusAlert status={garden.status} />
            </Grid>
          </Grid>
          Connection Type: {garden.connection_type} <br />
          Known Namespaces:
          <List
            sx={{
              width: '100%',
              maxHeight: 400,
              maxWidth: 300,
              ml: 2,
              p: 0,
            }}
          >
            {garden.namespaces.map((namespace: string) => (
              <ListItem key={namespace} disableGutters disablePadding dense>
                {'\u25CF'} {namespace}
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  )
}

export { GardenAdminInfoCard }
