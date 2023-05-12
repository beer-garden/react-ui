import { Backdrop, CircularProgress, Grid, Stack } from '@mui/material'
import { Divider } from 'components/Divider'
import { ErrorAlert } from 'components/ErrorAlert'
import { GardenSyncButton } from 'components/GardenSyncButton'
import { PageHeader } from 'components/PageHeader'
import { Snackbar } from 'components/Snackbar'
import { PermissionsContainer } from 'containers/PermissionsContainer'
import { SocketContainer } from 'containers/SocketContainer'
import useGardens from 'hooks/useGardens'
import { useMountedState } from 'hooks/useMountedState'
import { CreateGarden, GardenAdminCard } from 'pages/GardenAdmin'
import { useEffect } from 'react'
import { Garden } from 'types/backend-types'
import { SnackbarState } from 'types/custom-types'

const GardenAdmin = (): JSX.Element => {
  const { hasPermission } = PermissionsContainer.useContainer()
  const { addCallback, removeCallback } = SocketContainer.useContainer()
  const { error, getGardens } = useGardens()
  const [gardens, setGardens] = useMountedState<Garden[]>([])
  const [requestStatus, setRequestStatus] = useMountedState<
    SnackbarState | undefined
  >()

  useEffect(() => {
    getGardens().then((response) => {
      setGardens(response.data)
    })
  }, [getGardens, setGardens])

  useEffect(() => {
    addCallback('garden_updates', (event) => {
      if (
        ['GARDEN_CREATED', 'GARDEN_UPDATED', 'GARDEN_REMOVED'].includes(
          event.name,
        )
      ) {
        getGardens().then((response) => {
          setGardens(response.data)
        })
      }
    })
    return () => {
      removeCallback('garden_updates')
    }
  }, [addCallback, getGardens, removeCallback, setGardens])

  return !error ? (
    <>
      <Stack direction="row" spacing={2} sx={{ float: 'right' }}>
        {hasPermission('garden:create') && (
          <CreateGarden setRequestStatus={setRequestStatus} />
        )}
        {hasPermission('garden:update') && (
          <GardenSyncButton gardenName="" setSyncStatus={setRequestStatus} />
        )}
      </Stack>
      <PageHeader title="Gardens Management" description="" />
      <Divider />
      <Grid container spacing={3} columns={3}>
        {gardens.map((garden: Garden) => (
          <Grid key={garden['name']} item xs={1} sx={{minWidth: '375px'}}>
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
      <CircularProgress color="inherit" aria-label="Garden data loading" />
    </Backdrop>
  )
}

export { GardenAdmin }
