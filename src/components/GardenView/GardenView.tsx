import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
} from '@mui/material'
import { AxiosResponse } from 'axios'
import { FC, useState } from 'react'
import { useParams } from 'react-router-dom'
import Divider from '../divider'
import InfoCard from '../garden_admin_info_card'
import GardenConnectionForm from './GardenConnection/GardenConnectionForm'
import PageHeader from '../page_header'
import Table from '../table'
import { Garden, System, TableState } from '../../custom_types/custom_types'
import GardenService from '../../services/garden_service'
import { systemLink } from '../../services/routing_links'

type FormState = {
  dataForm: any
  errors: any[]
}

const GardenViewApp: FC = () => {
  const schema = GardenService.SCHEMA
  const uischema = GardenService.UISCHEMA
  const initialModel = {}
  const [garden, setGarden] = useState<Garden>()
  const state: TableState = {
    completeDataSet: [],
    formatData: formatData,
    cacheKey: `lastKnown_${window.location.href}`,
    includePageNav: true,
    disableSearch: true,
    tableHeads: ['Namespace', 'System', 'Version'],
  }
  if (garden) {
    state.completeDataSet = garden.systems
  }
  const formState: FormState = {
    dataForm: {},
    errors: [],
  }
  const title = 'Garden View'
  const params = useParams()
  const garden_name = String(params.garden_name)

  if (!garden) {
    GardenService.getGarden(successCallback, garden_name)
  }

  function formatData (systems: System[]) {
    const tempData: (string | JSX.Element | number)[][] = []
    for (const i in systems) {
      tempData[i] = [
        systemLink(systems[i].namespace, [systems[i].namespace]),
        systemLink(systems[i].name, [systems[i].namespace, systems[i].name]),
        systemLink(systems[i].version, [
          systems[i].namespace,
          systems[i].name,
          systems[i].version,
        ]),
      ]
    }
    return tempData
  }

  function successCallback (response: AxiosResponse) {
    setGarden(response.data)
  }

  function getConfigSetup () {
    if (garden) {
      if (garden.connection_type === 'LOCAL') {
        return (
          <Alert severity="info">
            {
              "Since this is the local Garden it's not possible to modify connection information"
            }
          </Alert>
        )
      } else {
        return <GardenConnectionForm garden={garden} />
      }
    }
  }

  function renderComponents () {
    if (garden) {
      return (
        <Box>
          <InfoCard garden={garden} />
          <Typography variant="h6">Connected Systems</Typography>
          <Table parentState={state} />
          {getConfigSetup()}
        </Box>
      )
    } else {
      return (
        <Backdrop open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )
    }
  }
  return (
    <Box pb={10}>
      <Grid justifyContent="space-between" container>
        <Grid item>
          <PageHeader title={title} description={''} />
        </Grid>
        <Grid item>
          <Typography style={{ flex: 1 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => GardenService.syncGarden(garden_name)}
            >
              Sync
            </Button>
          </Typography>
        </Grid>
      </Grid>
      <Divider />
      {renderComponents()}
    </Box>
  )
}

export default GardenViewApp
