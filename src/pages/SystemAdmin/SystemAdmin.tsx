import { Backdrop, CircularProgress, Stack, Typography } from '@mui/material'
import { Box, Button, Grid, Tooltip } from '@mui/material'
import { AxiosError } from 'axios'
import { Divider } from 'components/Divider'
import { ErrorAlert } from 'components/ErrorAlert'
import { ModalWrapper } from 'components/ModalWrapper'
import { PageHeader } from 'components/PageHeader'
import useAdmin from 'hooks/useAdmin'
import { useMountedState } from 'hooks/useMountedState'
import useQueue from 'hooks/useQueue'
import { SystemsCard, UnassociatedRunnersCard } from 'pages/SystemAdmin'


const SystemAdmin = () => {
  const [open, setOpen] = useMountedState<boolean>(false)
  const [error, setError] = useMountedState<AxiosError | undefined>()
  const { rescanPluginDirectory } = useAdmin()
  const { clearQueues } = useQueue()

  return !error ? (
    <Box>
      <Grid alignItems="start" justifyContent="space-between" container>
        <Grid key="header" item>
          <PageHeader title="Systems Management" description="" />
        </Grid>
        <Grid key="actions" item>
          <Stack direction="row" spacing={2}>
            <Tooltip arrow title="Clear All Queues">
              <Button
                variant="contained"
                color="error"
                onClick={() => setOpen(true)}
              >
                Clear All Queues
              </Button>
            </Tooltip>
            <Tooltip arrow title="Rescan Plugin Directory">
              <Button
                onClick={rescanPluginDirectory}
                variant="contained"
                color="primary"
              >
                Rescan Plugin Directory
              </Button>
            </Tooltip>
          </Stack>
        </Grid>
      </Grid>
      <ModalWrapper
        open={open}
        header="Clear All Local Queues?"
        onClose={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        onSubmit={() => {
          clearQueues()
          setOpen(false)
        }}
        content={
          <Typography my={2}>
            All outstanding request messages will be deleted for all systems of
            the local garden. Remote gardens will not be affected. This action
            cannot be undone.
          </Typography>
        }
        styleOverrides={{ size: 'sm', top: '-55%' }}
      />
      <Divider />
      <UnassociatedRunnersCard />
      <SystemsCard setError={setError} />
    </Box>
  ) : error?.response ? (
    <ErrorAlert
      statusCode={error.response.status}
      errorMsg={error.response.statusText}
    />
  ) : (
    <Backdrop open={true}>
      <CircularProgress color="inherit" aria-label="System data loading" />
    </Backdrop>
  )
}

export { SystemAdmin }
