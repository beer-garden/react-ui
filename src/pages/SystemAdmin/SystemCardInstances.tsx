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
import LogModal from 'components/LogModal'
import { ModalWrapper } from 'components/ModalWrapper'
import OverflowTooltip from 'components/overflowTooltip'
import QueueModal from 'components/QueueModal'
import useSystems from 'hooks/useSystems'
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state'
import { alertStyle, getSeverity } from 'pages/SystemAdmin'
import { useState } from 'react'
import { Instance } from 'types/backend-types'

interface ISystemCard {
  instances: Instance[]
  fileHeader: string
}

const SystemCardInstances = ({ instances, fileHeader }: ISystemCard) => {
  const { startInstance, stopInstance } = useSystems()

  const [logModal, setLogModal] = useState<boolean>(false)

  const [queueModal, setQueueModal] = useState<boolean>(false)

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
                      setQueueModal(true)
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
              </>
            )}
          </PopupState>
        ))}
      </CardActions>
    </>
  )
}

export default SystemCardInstances
