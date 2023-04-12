import {
  Cached as CachedIcon,
  Delete as DeleteIcon,
  PlayCircleFilled as PlayCircleFilledIcon,
  Stop as StopIcon,
} from '@mui/icons-material'
import {
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import { ModalWrapper } from 'components/ModalWrapper'
import OverflowTooltip from 'components/OverflowTooltip'
import { Snackbar } from 'components/Snackbar'
import { SocketContainer } from 'containers/SocketContainer'
import { useMountedState } from 'hooks/useMountedState'
import { useRunners } from 'hooks/useRunners'
import { RunnerCardInstances } from 'pages/SystemAdmin'
import { useCallback, useEffect } from 'react'
import { Runner } from 'types/backend-types'
import { SnackbarState } from 'types/custom-types'

const UnassociatedRunnersCard = () => {
  const [groupedUnassociatedRunners, setGroupedUnassociatedRunners] = useMountedState<
    { [path: string]: Runner[] }
  >({})
  const [alert, setAlert] = useMountedState<SnackbarState | undefined>()
  const { addCallback, removeCallback } = SocketContainer.useContainer()
  const { getRunners, startRunner, stopRunner, reloadRunner, deleteRunner } =
    useRunners()
  const [open, setOpen] = useMountedState<boolean>(false)
  const [runners, setRunners] = useMountedState<Runner[]>()
  const [path, setPath] = useMountedState<string>()
  

  const updateRunners = useCallback(() => {
    getRunners()
      .then((response) => {
          const groupedUnassociatedRunners: { [path: string]: Runner[] } = {}
        response.data.forEach((runner: Runner) => {
          if(runner.instance_id === ''){
            if(!groupedUnassociatedRunners[runner.path]){
              groupedUnassociatedRunners[runner.path] = []
            }
            groupedUnassociatedRunners[runner.path].push(runner)
          }
        })
        setGroupedUnassociatedRunners(groupedUnassociatedRunners)
      })
      .catch((e) => {
        setAlert({
          severity: 'error',
          message: e,
          doNotAutoDismiss: true,
        })
      })
  }, [getRunners, setAlert, setGroupedUnassociatedRunners])

  useEffect(() => {
    updateRunners()
  }, [updateRunners])

  useEffect(() => {
    addCallback('runner_updates', (event) => {
      if (['RUNNER_STARTED', 'RUNNER_STOPPED', 'RUNNER_REMOVED'].includes(event.name)) {
        updateRunners()
      }
    })
    return () => {
      removeCallback('runner_updates')
    }
  }, [addCallback, removeCallback, updateRunners])

  return Object.entries(groupedUnassociatedRunners).length > 0 ? (
    <>
      <Card sx={{ height: '100%', mb: 2 }}>
          <OverflowTooltip
            color="common.white"
            variant="h3"
            tooltip="Unassociated Local Runners"
            text="Unassociated Local Runners"
            css={{ p: 1, backgroundColor: 'primary.main' }}
          />
        <CardContent>
          <Grid container
            columns={3}
            columnSpacing={2}
            rowSpacing={2}
          >
            {Object.entries(groupedUnassociatedRunners)
            .sort((a: [string, Runner[]], b: [string, Runner[]]) => (a[0] > b[0] ? 1 : -1))
            .map(([path, runners]) => (
              <Grid
                item
                key={`${path}Actions`}
                xs={1}
                sx={{minWidth: '400px'}}
              >
                <Card sx={{ backgroundColor: 'background.default'}} >
                  <CardContent>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      key={`stack${path}`}
                    >
                      <Typography variant="body1">
                        {path}
                      </Typography>
                      <Toolbar
                        variant="dense"
                        sx={{ minHeight: 36 }}
                      >
                        <Tooltip
                          arrow
                          title="Start all runners"
                          placement="bottom-start"
                        >
                          <IconButton
                            size="small"
                            onClick={() => {
                              runners.map((runner: Runner) =>
                                startRunner(runner.id).catch((e) => {
                                  setAlert({
                                    severity: 'error',
                                    message: e,
                                    doNotAutoDismiss: true,
                                  })
                                }),
                              )
                            }}
                            aria-label="start"
                          >
                            <PlayCircleFilledIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          arrow
                          title="Stop all runners"
                          placement="bottom-start"
                        >
                          <IconButton
                            size="small"
                            onClick={() => {
                              runners.map((runner: Runner) =>
                                stopRunner(runner.id).catch((e) => {
                                  setAlert({
                                    severity: 'error',
                                    message: e,
                                    doNotAutoDismiss: true,
                                  })
                                }),
                              )
                            }}
                            aria-label="stop"
                          >
                            <StopIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          arrow
                          title="Reload runners"
                          placement="bottom-start"
                        >
                          <IconButton
                            size="small"
                            onClick={() => {
                              reloadRunner(path).catch((e) => {
                                setAlert({
                                  severity: 'error',
                                  message: e,
                                  doNotAutoDismiss: true,
                                })
                              })
                            }}
                            aria-label="reload"
                          >
                            <CachedIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          arrow
                          title="Delete all runners"
                          placement="bottom-start"
                        >
                          <IconButton
                            size="small"
                            onClick={() => {
                              setRunners(runners)
                              setPath(path)
                              setOpen(true)
                            }}
                            aria-label="delete"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Toolbar>
                    </Stack>
                    <Divider sx={{pt: 1}} />
                    <RunnerCardInstances runners={runners} setAlert={setAlert} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
      <ModalWrapper
        open={open}
        header="Confirm Runners Deletion"
        onClose={() => setOpen(false)}
        onSubmit={() => {
          runners?.map((runner: Runner) =>
            deleteRunner(runner.id).then((responce) => setOpen(false)).catch((e) => {
              setOpen(false)
              setAlert({
                severity: 'error',
                message: e,
                doNotAutoDismiss: true,
              })
            }),
          )
        }}
        onCancel={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        styleOverrides={{ size: 'sm', top: '-55%' }}
        content={
          <Typography variant="body1">
            Are you sure you want to delete all runners in path: {path}?
          </Typography>
        }
      />
      {alert && <Snackbar status={alert} />}
    </>
  ) : (
    <></>
  )
}

export { UnassociatedRunnersCard }
