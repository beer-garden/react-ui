import {
  Alert,
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from '@mui/material'
import { AxiosError } from 'axios'
import useAxios from 'axios-hooks'
import Divider from 'components/divider'
import NamespaceSelect from 'components/namespace_select'
import PageHeader from 'components/PageHeader'
import SystemCard from 'components/system_admin_card'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { formatSystems } from 'pages/SystemAdmin'
import { Fragment, useEffect, useState } from 'react'
import AdminService from 'services/admin_service'
import CacheService from 'services/cache_service'
import { System } from 'types/custom_types'

function getSelectMessage(namespacesSelected: string[]): JSX.Element | void {
  if (!namespacesSelected.length) {
    return <Alert severity="info">Please select a namespace</Alert>
  }
}

const useGetData = (authIsEnabled: boolean): SystemAdminData => {
  const [{ data: systemsData, error: systemsError }] = useAxios({
    url: '/api/v1/systems',
    method: 'GET',
    withCredentials: authIsEnabled,
  })

  const [{ data: namespaceData, error: namespaceError }] = useAxios({
    url: '/api/v1/namespaces',
    method: 'GET',
    withCredentials: authIsEnabled,
  })

  return {
    systemsData: systemsData,
    systemsError: systemsError,
    namespaceData: namespaceData,
    namespaceError: namespaceError,
  }
}

interface SystemAdminData {
  systemsData: System[] | undefined
  systemsError: AxiosError | null
  namespaceData: string[] | undefined
  namespaceError: AxiosError | null
}

const SystemAdmin = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const [systems, setSystems] = useState<System[]>([])
  const [namespaces, setNamespaces] = useState<string[]>([])

  const { systemsData, systemsError, namespaceData, namespaceError } =
    useGetData(authEnabled)

  useEffect(() => {
    if (systemsData && !systemsError) {
      setSystems(systemsData)
    }
    if (namespaceData && !namespaceError) {
      setNamespaces(namespaceData)
    }
  }, [systemsData, systemsError, namespaceData, namespaceError])

  const [namespacesSelected, setNamespacesSelected] = useState(
    CacheService.getNamespacesSelected(
      `lastKnown_${window.location.href}`,
      namespaces,
    ).namespacesSelected,
  )

  const sortedSystems = formatSystems(namespacesSelected, systems)
  const title = 'Systems Management'

  return (
    <Fragment>
      <Grid alignItems="flex-end" justifyContent="space-between" container>
        <Grid key={'header'} item>
          <PageHeader title={title} description={''} />
        </Grid>
        <Grid key={'actions'} item>
          <Box display="flex" alignItems="center" flexDirection="row">
            <Box>
              <NamespaceSelect
                namespaces={namespaces}
                namespacesSelected={namespacesSelected}
                setNamespacesSelected={setNamespacesSelected}
              />
            </Box>
            <Box>
              <Button variant="contained" color="secondary">
                Clear All Queues
              </Button>
              <Button
                onClick={() => AdminService.rescan()}
                variant="contained"
                color="primary"
              >
                Rescan Plugin Directory
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Divider />
      <Box>
        {namespacesSelected.map((namespace: string) => (
          <Box py={1} key={namespace + 'box'}>
            <Card>
              <AppBar
                color="inherit"
                style={{ background: 'lightgray' }}
                position="static"
              >
                <Box p={0.5}>
                  <Typography variant="h5" color="inherit">
                    {namespace}
                  </Typography>
                </Box>
              </AppBar>
              <CardContent>
                <Grid container spacing={2}>
                  <Box
                    display="flex"
                    flexWrap="wrap"
                    flexDirection="row"
                    key={'systems' + namespace}
                  >
                    {sortedSystems[namespace].map(
                      (systems: System[], index: number) => (
                        <Box
                          key={'systems' + index + namespace}
                          minWidth={0.24}
                          p={1}
                          maxWidth={1 / 2}
                        >
                          <SystemCard systems={systems} namespace={namespace} />
                        </Box>
                      ),
                    )}
                  </Box>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        ))}
        {getSelectMessage(namespacesSelected)}
      </Box>
    </Fragment>
  )
}

export { SystemAdmin }
