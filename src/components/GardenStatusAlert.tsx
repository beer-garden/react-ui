import { Alert } from '@mui/material'

const alertStyle = {
  '& .MuiAlert-message': {
    padding: '0px',
  },
  '& .MuiAlert-icon': {
    padding: '4px 0',
  },
  py: 0,
  width: '100%',
}

const getSeverity = (status: string) => {
  switch (status) {
    case 'RUNNING':
      return 'success'
    case 'UNREACHABLE':
    case 'NOT_CONFIGURED':
    case 'UNKNOWN':
      return 'warning'
    case 'INITIALIZING':
    case 'BLOCKED':
      return 'info'
    case 'ERROR':
    case 'STOPPED':
      return 'error'
    default:
      break
  }
}

interface GardenStatusAlertProps {
  status: string
}

const GardenStatusAlert = ({ status }: GardenStatusAlertProps) => {
  return (
    <Alert
      sx={{ ...alertStyle, py: 0.1 }}
      icon={false}
      severity={getSeverity(status)}
    >
      {status}
    </Alert>
  )
}

export { GardenStatusAlert }
