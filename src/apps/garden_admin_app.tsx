import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid'

import GardensService from '../services/garden_service'
import PageHeader from '../components/page_header'
import GardenCard from '../components/garden_admin_card'
import Divider from '../components/divider'
import { AxiosResponse } from 'axios'
import { Garden } from '../custom_types/custom_types'

const GardensAdminApp = (): JSX.Element => {
  const [gardens, setGardens] = useState<Garden[]>([])
  const title = 'Gardens Management'
  if (!gardens[0]) {
    GardensService.getGardens(successCallback)
  }

  function successCallback(response: AxiosResponse) {
    setGardens(response.data)
  }
  return (
    <div>
      <PageHeader title={title} description={''} />
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

export default GardensAdminApp
