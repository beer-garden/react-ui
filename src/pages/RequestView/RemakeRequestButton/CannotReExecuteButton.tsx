import { Button, Tooltip } from '@material-ui/core'
import { useTheme } from '@mui/material/styles'

interface CannotReExecuteButtonProps {
  message: string
}

const CannotReExecuteButton = ({ message }: CannotReExecuteButtonProps) => {
  const theme = useTheme()
  return (
    <Tooltip title={message} data-testid="cannot-execute-button">
      <Button
        component="div"
        disabled
        variant="contained"
        style={{
          float: 'right',
          pointerEvents: 'auto',
          // theme style override not applying for some reason
          color: theme.palette.action.disabled,
        }}
      >
        Remake Request
      </Button>
    </Tooltip>
  )
}

export { CannotReExecuteButton }
