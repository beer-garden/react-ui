import { Grid } from '@mui/material'
import useAxios from 'axios-hooks'
import { useEffect, useState } from 'react'
import Divider from '../../components/divider'
import GardenCard from '../../components/garden_admin_card'
import PageHeader from '../../components/PageHeader'
import { ServerConfigContainer } from '../../containers/ConfigContainer'
import { Garden } from '../../types/custom_types'

const GardensAdmin = (): JSX.Element => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const [gardens, setGardens] = useState<Garden[]>([])
  const [{ data, error }] = useAxios({
    url: '/api/v1/gardens',
    method: 'get',
    withCredentials: authEnabled(),
  })

  useEffect(() => {
    if (data && !error) {
      setGardens(data)
    }
  }, [data, error])

  return (
    <div>
      <PageHeader title={'Gardens Management'} description={''} />
      <Divider />
      <Grid container spacing={3}>
        {gardens.map((garden: Garden) => (
          <Grid key={garden['name']} item xs={4}>
            <GardenCard garden={garden} />
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

export default GardensAdmin
