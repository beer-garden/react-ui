import {
  Alert,
  Backdrop,
  Box,
  CircularProgress,
  Typography,
} from '@mui/material'
import useAxios from 'axios-hooks'
import Divider from 'components/divider'
import InfoCard from 'components/garden_admin_info_card'
import PageHeader from 'components/PageHeader'
import Table from 'components/table'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import {
  GardenConnectionForm,
  GardenSyncButton,
  SubmissionStatusSnackbar,
  SubmissionStatusState,
} from 'pages/GardenAdminView'
import { useEffect, useState } from 'react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { Garden, System, TableState } from 'types/custom_types'

const SystemLink = (text: string, params: string[]) => {
  return <RouterLink to={'/systems/' + params.join('/')}>{text}</RouterLink>
}

const GardenAdminView = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()

  const [syncStatus, setSyncStatus] = useState<
    SubmissionStatusState | undefined
  >(undefined)
  const [garden, setGarden] = useState<Garden>()
  const params = useParams()

  const gardenName = String(params.gardenName)

  const [{ data, error }] = useAxios({
    url: '/api/v1/gardens/' + gardenName,
    method: 'get',
    withCredentials: authEnabled,
  })

  useEffect(() => {
    if (data && !error) {
      setGarden(data)
    }
  }, [data, error])

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

  function formatData(systems: System[]) {
    const tempData: (string | JSX.Element | number)[][] = []
    for (const i in systems) {
      tempData[i] = [
        SystemLink(systems[i].namespace, [systems[i].namespace]),
        SystemLink(systems[i].name, [systems[i].namespace, systems[i].name]),
        SystemLink(systems[i].version, [
          systems[i].namespace,
          systems[i].name,
          systems[i].version,
        ]),
      ]
    }
    return tempData
  }

  function getConfigSetup() {
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

  function renderComponents() {
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
      <Typography style={{ flex: 1, float: 'right' }}>
        <GardenSyncButton
          gardenName={gardenName}
          setSyncStatus={setSyncStatus}
        />
      </Typography>
      <PageHeader title={'Garden View'} description={''} />
      <Divider />
      {renderComponents()}
      {syncStatus ? (
        <SubmissionStatusSnackbar
          status={syncStatus as SubmissionStatusState}
        />
      ) : null}
    </Box>
  )
}

export { GardenAdminView }
