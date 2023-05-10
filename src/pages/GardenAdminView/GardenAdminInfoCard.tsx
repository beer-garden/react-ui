import { Grid, List, ListItem, Typography } from '@mui/material'
import { LabeledData } from 'components/LabeledData'
import { Garden } from 'types/backend-types'

interface GardenInfoCardProps {
  garden: Garden
}

const GardenAdminInfoCard = ({ garden }: GardenInfoCardProps) => {
  return (
    <>
      <Typography variant="h3" color="inherit">
        Garden Info
      </Typography>
      <Grid
        container
        columns={3}
        rowSpacing={1}
        columnSpacing={4}
        pl={4}
      >
        <Grid item >
          <LabeledData label="Name" data={garden.name} />
        </Grid>
        <Grid item >
          <LabeledData label="Status" data={garden.status} alert />
        </Grid>
        <Grid item >
          <LabeledData label="Connection Type" data={garden.connection_type} />
        </Grid>
        <Grid item xs={3} >
          <Typography sx={{ my: 2 }} fontWeight={'bold'} variant="overline">
            Known Namespaces:
          </Typography>
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
        </Grid>
      </Grid>
    </>
  )
}

export { GardenAdminInfoCard }
