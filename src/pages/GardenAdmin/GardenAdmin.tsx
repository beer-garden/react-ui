import { Backdrop, Box, CircularProgress, Grid } from '@mui/material'
import useAxios from 'axios-hooks'
import { Divider } from 'components/Divider'
import { ErrorAlert } from 'components/ErrorAlert'
import { GardenSyncButton } from 'components/GardenSyncButton'
import { PageHeader } from 'components/PageHeader'
import { Snackbar } from 'components/Snackbar'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { PermissionsContainer } from 'containers/PermissionsContainer'
import { SocketContainer } from 'containers/SocketContainer'
import { CreateGarden, GardenAdminCard } from 'pages/GardenAdmin'
import { useEffect, useState } from 'react'
import { Garden } from 'types/backend-types'
import { SnackbarState } from 'types/custom-types'

const GardensAdmin = (): JSX.Element => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const { hasPermission } = PermissionsContainer.useContainer()
  const [gardens, setGardens] = useState<Garden[]>([])
  const [{ data, error }, refetch] = useAxios({
    url: '/api/v1/gardens',
    method: 'get',
    withCredentials: authEnabled,
  })

  const [requestStatus, setRequestStatus] = useState<SnackbarState | undefined>(
    undefined,
  )

  useEffect(() => {
    if (data && !error) {
      setGardens(data)
    }
  }, [data, error])

  const { addCallback, removeCallback } = SocketContainer.useContainer()

  useEffect(() => {
    addCallback('garden_updates', (event) => {
      if (
        ['GARDEN_CREATED', 'GARDEN_UPDATED', 'GARDEN_REMOVED'].includes(
          event.name,
        )
      ) {
        refetch()
      }
    })
    return () => {
      removeCallback('garden_updates')
    }
  }, [addCallback, removeCallback, refetch])

  return !error ? (
    <>
      {hasPermission('garden:create') && (
        <CreateGarden setRequestStatus={setRequestStatus} />
      )}
      {hasPermission('garden:update') && (
        <Box style={{ float: 'right' }}>
          <GardenSyncButton gardenName={''} setSyncStatus={setRequestStatus} />
        </Box>
      )}
      <PageHeader title="Gardens Management" description="" />
      <Divider />
      <Grid container spacing={3}>
        {gardens.map((garden: Garden) => (
          <Grid key={garden['name']} item xs={4}>
            <GardenAdminCard
              garden={garden}
              setRequestStatus={setRequestStatus}
            />
          </Grid>
        ))}
      </Grid>
      {requestStatus ? <Snackbar status={requestStatus} /> : null}
    </>
  ) : error.response ? (
    <ErrorAlert
      statusCode={error.response.status}
      errorMsg={error.response.statusText}
    />
  ) : (
    <Backdrop open={true}>
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}

export { GardensAdmin }
