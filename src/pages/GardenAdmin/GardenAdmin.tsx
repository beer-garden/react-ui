import { Grid } from '@mui/material'
import useAxios from 'axios-hooks'
import { useEffect, useState } from 'react'
import Divider from '../../components/divider'
import GardenCard from '../../components/garden_admin_card'
import PageHeader from '../../components/PageHeader'
import { Garden } from '../../types/custom_types'
import { useIsAuthEnabled } from '../../hooks/useIsAuthEnabled'

const GardensAdmin = (): JSX.Element => {
  const [gardens, setGardens] = useState<Garden[]>([])
  const { authIsEnabled } = useIsAuthEnabled()
  const [{ data, error }] = useAxios({
    url: '/api/v1/gardens',
    method: 'get',
    withCredentials: authIsEnabled,
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
