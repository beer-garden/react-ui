import {
  Cached as CachedIcon,
  Delete as DeleteIcon,
  PlayCircleFilled as PlayCircleFilledIcon,
  Stop as StopIcon,
} from '@mui/icons-material'
import {
  Alert,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Grid,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import { Snackbar } from 'components/Snackbar'
import { SocketContainer } from 'containers/SocketContainer'
import { useMountedState } from 'hooks/useMountedState'
import { useRunners } from 'hooks/useRunners'
import { alertStyle } from 'pages/SystemAdmin'
import { useCallback, useEffect } from 'react'
import { Runner } from 'types/backend-types'
import { SnackbarState } from 'types/custom-types'

const UnassociatedRunnersCard = () => {
  const [unassociatedRunners, setUnassociatedRunners] = useMountedState<
    Runner[]
  >([])
  const [expanded, setExpanded] = useMountedState<boolean>(true)
  const [alert, setAlert] = useMountedState<SnackbarState | undefined>()
  const { addCallback, removeCallback } = SocketContainer.useContainer()
  const { getRunners, startRunner, stopRunner, reloadRunner, deleteRunner } =
    useRunners()

  const updateRunners = useCallback(() => {
    getRunners()
      .then((response) => {
        setUnassociatedRunners(
          response.data.filter((element: Runner) => {
            return element.instance_id === ''
          }),
        )
      })
      .catch((e) => {
        setAlert({
          severity: 'error',
          message: e,
          doNotAutoDismiss: true,
        })
      })
  }, [getRunners, setAlert, setUnassociatedRunners])

  useEffect(() => {
    updateRunners()
  }, [updateRunners])

  useEffect(() => {
    addCallback('runner_updates', (event) => {
      if (
        event.name === 'RUNNER_STARTED' ||
        event.name === 'RUNNER_STOPPED' ||
        event.name === 'RUNNER_REMOVED'
      ) {
        updateRunners()
      }
    })
    return () => {
      removeCallback('runner_updates')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addCallback, removeCallback])

  const data: { [key: string]: Runner[] } = {}
  unassociatedRunners.forEach((runner: Runner) => {
    if (data[runner.path]) {
      data[runner.path].push(runner)
    } else {
      data[runner.path] = [runner]
    }
  })

  return unassociatedRunners.length > 0 ? (
    <>
      <Card>
        <Alert
          variant="outlined"
          sx={{
            ...alertStyle,
            backgroundColor: 'primary.main',
          }}
          severity="error"
          onClick={() => setExpanded(!expanded)}
          title="Click to collapse"
        >
          <Typography variant="h3" color="common.white" p={0.25}>
            Unassociated Local Runners
          </Typography>
        </Alert>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Grid container flexWrap="wrap" flexDirection="row">
              {Object.entries(data).map(([path, runners]) => (
                <Grid item key={path} minWidth={0.1} p={0.25} maxWidth={0.3}>
                  <Card sx={{ width: 1 }}>
                    <Alert
                      variant="outlined"
                      sx={{
                        ...alertStyle,
                        backgroundColor: 'primary.main',
                      }}
                      severity="error"
                      title={path}
                    >
                      <Typography variant="h3" color="common.white" p={0.25}>
                        {path}
                      </Typography>
                    </Alert>
                    <CardActions>
                      <Grid item key={`${path}Actions`}>
                        <Toolbar
                          variant="dense"
                          disableGutters
                          sx={{ minHeight: 36 }}
                        >
                          <Tooltip
                            arrow
                            title="Start all instances"
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
                            title="Stop all instances"
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
                            title="Reload system"
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
                            title="Delete system"
                            placement="bottom-start"
                          >
                            <IconButton
                              size="small"
                              onClick={() => {
                                runners.map((runner: Runner) =>
                                  deleteRunner(runner.id).catch((e) => {
                                    setAlert({
                                      severity: 'error',
                                      message: e,
                                      doNotAutoDismiss: true,
                                    })
                                  }),
                                )
                              }}
                              aria-label="delete"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Toolbar>
                      </Grid>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Collapse>
      </Card>
      {alert && <Snackbar status={alert} />}
    </>
  ) : (
    <></>
  )
}

export { UnassociatedRunnersCard }
