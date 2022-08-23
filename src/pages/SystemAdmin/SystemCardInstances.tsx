import {
  PlayCircleFilled as PlayIcon,
  Queue as QueueIcon,
  Receipt as ReceiptIcon,
  Stop as StopIcon,
} from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
  Alert,
  AlertColor,
  Button,
  CardActions,
  CircularProgress,
  FormControl,
  Input,
  InputLabel,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
} from '@mui/material'
import MuiInput from '@mui/material/Input'
import { useTheme } from '@mui/material/styles'
import { ModalWrapper } from 'components/ModalWrapper'
import OverflowTooltip from 'components/overflowTooltip'
import { useInstances } from 'hooks/useInstances'
import useSystems from 'hooks/useSystems'
import { get } from 'lodash'
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state'
import { alertStyle, getSeverity } from 'pages/SystemAdmin'
import { ChangeEvent, useState } from 'react'
import { Instance } from 'types/backend-types'

interface LogAlert {
  type: AlertColor
  msg: string
}

const SystemCardInstances = ({ instances }: { instances: Instance[] }) => {
  const theme = useTheme()
  const wait = 30

  const [logModal, setLogModal] = useState<boolean>(false)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [tailLines, setTailLines] = useState<number>(20)
  const [startLine, setStartLine] = useState<number>(0)
  const [endLine, setEndLine] = useState<number>(20)
  const [alerts, setAlerts] = useState<LogAlert[]>([
    {
      type: 'info',
      msg:
        'Plugin must be listening to the Admin Queue and logging' +
        ' to File for logs to be returned. This will only return information' +
        ' from the log file being actively written to.',
    },
  ])

  const { getInstanceLogs } = useInstances()
  const { startInstance, stopInstance } = useSystems()

  const getLogs = (id: string, start?: number, end?: number) =>
    getInstanceLogs(id, wait, start, end)
      .then((response) => {
        setIsLoading(false)
      })
      .catch((e) => {
        setIsLoading(false)
        setAlerts([
          ...alerts,
          {
            type: 'error',
            msg:
              'Something went wrong on the backend: ' +
              get(e, 'data.message', 'Please check the server logs'),
          },
        ])
      })

  return (
    <>
      <CardActions sx={{ justifyContent: 'center' }}>
        {instances.map((instance: Instance) => (
          <PopupState
            key={instance.name}
            variant="popover"
            popupId="demo-popup-menu"
          >
            {(popupState) => (
              <>
                <Button
                  {...bindTrigger(popupState)}
                  variant="contained"
                  size="small"
                  sx={{ padding: 0, minWidth: '50px', maxWidth: '150px' }}
                >
                  <Tooltip arrow title={instance.status} placement="top-start">
                    <Alert
                      severity={getSeverity(instance.status)}
                      sx={alertStyle}
                      icon={false}
                    >
                      <OverflowTooltip
                        variant="subtitle2"
                        tooltip={instance.name}
                        text={instance.name}
                        css={{ py: 0 }}
                      />
                    </Alert>
                  </Tooltip>
                </Button>
                <Menu {...bindMenu(popupState)}>
                  <MenuItem
                    dense
                    divider
                    sx={{ fontSize: '13px' }}
                    key="start"
                    onClick={() => {
                      popupState.close()
                      startInstance(instance.id).then((resp) => {
                        // TODO: eventually updates just the button, find a better way
                        instance.status = resp
                        // TODO: would need to extend instance type
                        //instance.severity = getSeverity(resp)
                      })
                    }}
                  >
                    <ListItemIcon>
                      <PlayIcon />
                    </ListItemIcon>
                    <ListItemText>Start</ListItemText>
                  </MenuItem>
                  <MenuItem
                    dense
                    divider
                    sx={{ fontSize: '13px' }}
                    key="stop"
                    onClick={() => {
                      popupState.close()
                      stopInstance(instance.id).then((resp) => {
                        // TODO: eventually updates just the button, find a better way
                        instance.status = resp
                        // TODO: would need to extend instance type
                        //instance.severity = getSeverity(resp)
                      })
                    }}
                  >
                    <ListItemIcon>
                      <StopIcon />
                    </ListItemIcon>
                    <ListItemText>Stop</ListItemText>
                  </MenuItem>
                  <MenuItem
                    dense
                    divider
                    sx={{ fontSize: '13px' }}
                    onClick={() => {
                      setLogModal(true)
                      popupState.close()
                    }}
                  >
                    <ListItemIcon>
                      <ReceiptIcon />
                    </ListItemIcon>
                    <ListItemText>Show Logs</ListItemText>
                  </MenuItem>
                  <MenuItem
                    dense
                    divider
                    sx={{ fontSize: '13px' }}
                    onClick={() => {
                      popupState.close()
                    }}
                  >
                    <ListItemIcon>
                      <QueueIcon />
                    </ListItemIcon>
                    <ListItemText>Manage Queue</ListItemText>
                  </MenuItem>
                </Menu>
                <ModalWrapper
                  open={logModal}
                  header={`Logs for ${instance.name}`}
                  onClose={() => setLogModal(false)}
                  customButton={{
                    label: 'Close',
                    cb: () => {
                      setLogModal(false)
                    },
                  }}
                  content={
                    <>
                      {alerts.map((logAlert: LogAlert, index: number) => (
                        <Alert
                          severity={logAlert.type}
                          key={`logAlert-${index}`}
                        >
                          {logAlert.msg}
                        </Alert>
                      ))}
                      <FormControl
                        size="small"
                        sx={{
                          margin: theme.spacing(1),
                          minWidth: 255,
                        }}
                      >
                        <LoadingButton
                          size="small"
                          color="secondary"
                          loading={isLoading}
                          onClick={() => {
                            setIsLoading(true)
                            getLogs(instance.id, tailLines * -1)
                          }}
                        >
                          Get Tail Logs
                        </LoadingButton>
                        <InputLabel id="tailLinesLabel">Tail Lines:</InputLabel>
                        <Input
                          id="tailLinesInput"
                          type="number"
                          value={tailLines}
                          size="small"
                          onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            setTailLines(parseInt(event.target.value))
                          }}
                        />
                      </FormControl>
                      <FormControl
                        size="small"
                        sx={{
                          margin: theme.spacing(1),
                          minWidth: 255,
                        }}
                      >
                        <LoadingButton
                          size="small"
                          color="secondary"
                          loading={isLoading}
                          onClick={() => {
                            setIsLoading(true)
                            getLogs(instance.id, startLine, endLine)
                          }}
                        >
                          Get Line Logs
                        </LoadingButton>
                        <InputLabel id="startLineLabel">Start Line:</InputLabel>
                        <Input
                          id="startLineInput"
                          type="number"
                          value={startLine}
                          size="small"
                          onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            setStartLine(parseInt(event.target.value))
                          }}
                        />
                        <InputLabel id="endLineLabel">End Line:</InputLabel>
                        <Input
                          id="endLineInput"
                          type="number"
                          value={endLine}
                          size="small"
                          onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            setEndLine(parseInt(event.target.value))
                          }}
                        />
                        <Input
                          id="endLineInput"
                          type="number"
                          value={endLine}
                          size="small"
                          inputProps={{
                            step: 1,
                            min: 0,
                            max: 99999,
                            type: 'number',
                          }}
                        />
                        <TextField
                          label="End Line"
                          value={endLine}
                          inputProps={{
                            inputMode: 'numeric',
                            pattern: '[0-9]*',
                          }}
                        />
                        <MuiInput
                          value={endLine}
                          size="small"
                          inputProps={{
                            step: 1,
                            min: 0,
                            max: 99999,
                            type: 'number',
                          }}
                        />
                      </FormControl>
                      <LoadingButton
                        size="small"
                        color="secondary"
                        loading={isLoading}
                        // onClick={downloadLogs}
                      >
                        Download Logs
                      </LoadingButton>
                      (isLoading && {<CircularProgress color="inherit" />}
                      (!isLoading && {}))
                    </>
                  }
                />
              </>
            )}
          </PopupState>
        ))}
      </CardActions>
    </>
  )
}

export default SystemCardInstances
