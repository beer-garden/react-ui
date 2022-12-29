import { Box, List, ListItem, Typography } from '@mui/material'
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
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, 180px)',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <LabeledData label="Name" data={garden.name} />
        <LabeledData label="Status" data={garden.status} alert />
        <LabeledData label="Connection Type" data={garden.connection_type} />
        <Box
          sx={{
            gridColumnStart: '1',
          }}
        >
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
        </Box>
      </Box>
    </>
  )
}

export { GardenAdminInfoCard }
