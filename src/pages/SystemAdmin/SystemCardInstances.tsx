import {
  PlayCircleFilled as PlayIcon,
  Queue as QueueIcon,
  Receipt as ReceiptIcon,
  Stop as StopIcon,
} from '@mui/icons-material'
import {
  Alert,
  Button,
  CardActions,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material'
import OverflowTooltip from 'components/overflowTooltip'
import useSystems from 'hooks/useSystems'
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state'
import { alertStyle, getSeverity } from 'pages/SystemAdmin'
import { Instance } from 'types/custom_types'

const SystemCardInstances = ({ instances }: { instances: Instance[] }) => {
  const systemClient = useSystems()

  return (
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
                    systemClient.startInstance(instance.id).then((resp) => {
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
                    systemClient.stopInstance(instance.id).then((resp) => {
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
            </>
          )}
        </PopupState>
      ))}
    </CardActions>
  )
}

export default SystemCardInstances
