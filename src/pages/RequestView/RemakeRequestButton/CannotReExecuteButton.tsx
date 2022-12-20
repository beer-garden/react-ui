import { Button, Tooltip } from '@material-ui/core'

interface CannotReExecuteButtonProps {
  message: string
}

const CannotReExecuteButton = ({ message }: CannotReExecuteButtonProps) => {
  return (
    <Tooltip title={message} data-testid="cannot-execute-button">
      <Button
        component="div"
        disabled
        variant="contained"
        color="secondary"
        style={{ float: 'right', pointerEvents: 'auto' }}
      >
        {'Remake Request'}
      </Button>
    </Tooltip>
  )
}

export { CannotReExecuteButton }
