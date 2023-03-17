import {
  Menu as MenuIcon,
  PlayCircleFilled as PlayCircleFilledIcon,
  Queue as QueueIcon,
  Receipt as ReceiptIcon,
  Stop as StopIcon,
} from '@mui/icons-material'
import {
  Alert,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import LogModal from 'components/LogModal'
import { ModalWrapper } from 'components/ModalWrapper'
import QueueModal from 'components/QueueModal'
import { useInstances } from 'hooks/useInstances'
import { useMountedState } from 'hooks/useMountedState'
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state'
import { alertStyle, getSeverity } from 'pages/SystemAdmin'
import { Instance } from 'types/backend-types'

interface ISystemCard {
  instances: Instance[]
  fileHeader: string
}

const SystemCardInstances = ({ instances, fileHeader }: ISystemCard) => {
  const { startInstance, stopInstance } = useInstances()
  const [logModal, setLogModal] = useMountedState<boolean>(false)
  const [queueModal, setQueueModal] = useMountedState<boolean>(false)

  return (
    <Stack divider={<Divider />} sx={{width: '100%'}}>
      {instances.sort((a: Instance, b: Instance) => (a.name > b.name ? 1 : -1)).map((instance: Instance) => (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          key={`stack${instance.name}`}
        > 
          <Stack alignItems="center" direction="row" spacing={1}>
            <Alert
              severity={getSeverity(instance.status)}
              sx={alertStyle}
              icon={false}
              key={`status${instance.name}`}
            >
              {instance.status}
            </Alert>
            <Typography variant="body1" color="textSecondary">
              {instance.name}
            </Typography>
          </Stack>
          <Toolbar variant="dense" >
            <Tooltip
              arrow
              title={`Start instance ${instance.name}`}
              placement="bottom-start"
            >
              <IconButton
                size="small"
                onClick={() => startInstance(instance.id).then((resp) => {
                  instance.status = resp
                })}
                aria-label="start"
              >
                <PlayCircleFilledIcon />
              </IconButton>
            </Tooltip>
            <Tooltip
              arrow
              title={`Stop instance ${instance.name}`}
              placement="bottom-start"
            >
              <IconButton
                size="small"
                onClick={() => stopInstance(instance.id).then((resp) => {
                  instance.status = resp
                })}
                aria-label="stop"
              >
                <StopIcon />
              </IconButton>
            </Tooltip>
            <PopupState
              key={instance.name}
              variant="popover"
              popupId="popup-menu"
            >
              {(popupState) => (
                <>
                  <Tooltip
                    arrow
                    title={`Menu instance ${instance.name}`}
                    placement="bottom-start"
                  >
                    <IconButton
                      {...bindTrigger(popupState)}
                      size="small"
                      data-testid={`${instance.name}-menu-button`}
                    >
                      <MenuIcon />
                    </IconButton>
                  </Tooltip>
                    <Menu {...bindMenu(popupState)}>
                      <MenuItem
                        dense
                        divider
                        sx={{ fontSize: '0.9375rem' }}
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
                        sx={{ fontSize: '0.9375rem' }}
                        onClick={() => {
                          popupState.close()
                          setQueueModal(true)
                        }}
                      >
                        <ListItemIcon>
                          <QueueIcon />
                        </ListItemIcon>
                        <ListItemText>Manage Queue</ListItemText>
                      </MenuItem>
                    </Menu>
                </>
              )}
            </PopupState>
          </Toolbar>
          <ModalWrapper
            open={logModal}
            header={`Logs for ${fileHeader}-${instance.name}`}
            onClose={() => setLogModal(false)}
            customButton={{
              label: 'Close',
              cb: () => {
                setLogModal(false)
              },
              color: 'primary',
            }}
            content={
              <LogModal instance={instance} fileHeader={fileHeader} />
            }
          />
          <ModalWrapper
            open={queueModal}
            header={`Queue Manager: ${fileHeader}${instance.name}`}
            onClose={() => setQueueModal(false)}
            customButton={{
              label: 'Close',
              cb: () => {
                setQueueModal(false)
              },
              color: 'primary',
            }}
            content={<QueueModal instance={instance} />}
          />
        </Stack>
      ))}
    </Stack>
  )
}

export default SystemCardInstances
