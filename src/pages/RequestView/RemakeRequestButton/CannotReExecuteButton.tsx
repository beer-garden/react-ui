import { Button, Tooltip } from '@mui/material'
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
          color: theme.palette.action.disabled,
        }}
      >
        Remake Request
      </Button>
    </Tooltip>
  )
}

export { CannotReExecuteButton }
