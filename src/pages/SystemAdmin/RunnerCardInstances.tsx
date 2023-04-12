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
import { ModalWrapper } from 'components/ModalWrapper'
import { useMountedState } from 'hooks/useMountedState'
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
  const [open, setOpen] = useMountedState<boolean>(false)
  const [runner, setRunner] = useMountedState<Runner>()

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
              variant="filled"
              sx={alertStyle}
              icon={false}
              key={`status${runner.id}`}
            >
              {runner.dead ? 'DEAD' : runner.stopped ? 'STOPPED' : !runner.restart ? 'UNRESPONSIVE' : 'RUNNING'}
            </Alert>
            <Typography variant="body1">
              {runner.id}
            </Typography>
          </Stack>
          <Toolbar
            variant="dense"
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
                  setRunner(runner)
                  setOpen(true)
                }}
                aria-label="delete"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </Stack>
      ))}
      <ModalWrapper
        open={open}
        header="Confirm Runner Deletion"
        onClose={() => setOpen(false)}
        onSubmit={() => {
            if(runner) deleteRunner(runner.id).then((responce) => setOpen(false)).catch((e) => {
              setOpen(false)
              setAlert({
                severity: 'error',
                message: e,
                doNotAutoDismiss: true,
              })
            })
        }}
        onCancel={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        styleOverrides={{ size: 'sm', top: '-55%' }}
        content={
          <Typography variant="body1">
            Are you sure you want to delete runner: {runner?.id}?
          </Typography>
        }
      />
    </Stack>
  )
}

export { RunnerCardInstances }
