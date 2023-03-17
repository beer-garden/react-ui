import {
  Delete as DeleteIcon,
  PlayCircleFilled as PlayCircleFilledIcon,
  Stop as StopIcon,
} from '@mui/icons-material'
import {
  Alert,
  Divider,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import { useRunners } from 'hooks/useRunners'
import { alertStyle } from 'pages/SystemAdmin'
import { Runner } from 'types/backend-types'
import { SnackbarState } from 'types/custom-types'

const RunnerCardInstances = ({ runners, setAlert }: {runners: Runner[], setAlert: (alert: SnackbarState) => void}) => {
  const {
    startRunner,
    stopRunner,
    deleteRunner
  } = useRunners()

  return (
    <Stack divider={<Divider />} sx={{width: '100%'}}>
      {runners.map((runner: Runner) => (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          key={`stack${runner.id}`}
        >
          <Stack alignItems="center" direction="row" spacing={1}>
            <Alert
              severity={runner.dead || runner.stopped ? 'error' : !runner.restart ? 'warning' : 'success'}
              sx={alertStyle}
              icon={false}
              key={`status${runner.id}`}
            >
              {runner.dead ? 'DEAD' : runner.stopped ? 'STOPPED' : !runner.restart ? 'UNRESPONSIVE' : 'RUNNING'}
            </Alert>
            <Typography variant="body1" color="textSecondary">
              {runner.id}
            </Typography>
          </Stack>
          <Toolbar
            variant="dense"
            disableGutters
            sx={{ minHeight: 36 }}
          >
            <Tooltip
              arrow
              title="Start runner"
              placement="bottom-start"
            >
              <IconButton
                size="small"
                onClick={() => {
                  startRunner(runner.id).catch((e) => {
                    setAlert({
                      severity: 'error',
                      message: e,
                      doNotAutoDismiss: true,
                    })
                  })
                }}
                aria-label="start"
              >
                <PlayCircleFilledIcon />
              </IconButton>
            </Tooltip>
            <Tooltip
              arrow
              title="Stop runner"
              placement="bottom-start"
            >
              <IconButton
                size="small"
                onClick={() => {
                  stopRunner(runner.id).catch((e) => {
                    setAlert({
                      severity: 'error',
                      message: e,
                      doNotAutoDismiss: true,
                    })
                  })
                }}
                aria-label="stop"
              >
                <StopIcon />
              </IconButton>
            </Tooltip>
            <Tooltip
              arrow
              title="Delete runner"
              placement="bottom-start"
            >
              <IconButton
                size="small"
                onClick={() => {
                  deleteRunner(runner.id).catch((e) => {
                    setAlert({
                      severity: 'error',
                      message: e,
                      doNotAutoDismiss: true,
                    })
                  })
                }}
                aria-label="delete"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </Stack>
      ))}
    </Stack>
  )
}

export { RunnerCardInstances }
