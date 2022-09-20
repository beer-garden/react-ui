import { Box, Grid } from '@mui/material'
import useAxios from 'axios-hooks'
import { Divider } from 'components/Divider'
import GardenCard from 'components/garden_admin_card'
import { PageHeader } from 'components/PageHeader'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { useEffect, useState } from 'react'
import { Garden } from 'types/backend-types'

const GardensAdmin = (): JSX.Element => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const [gardens, setGardens] = useState<Garden[]>([])
  const [{ data, error }] = useAxios({
    url: '/api/v1/gardens',
    method: 'get',
    withCredentials: authEnabled,
  })

  useEffect(() => {
    if (data && !error) {
      setGardens(data)
    }
  }, [data, error])

  return (
    <Box>
      <PageHeader title="Gardens Management" description="" />
      <Divider />
      <Grid container spacing={3}>
        {gardens.map((garden: Garden) => (
          <Grid key={garden['name']} item xs={4}>
            <GardenCard garden={garden} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export { GardensAdmin }
