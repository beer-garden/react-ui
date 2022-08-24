import {
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
} from '@mui/material'

interface ModalProps {
  header: string
  open: boolean
  content: JSX.Element
  onClose: () => void
  onSubmit?: () => void
  onCancel?: () => void
  customButton?: ModalButtonProps
  styleOverrides?: { size: DialogProps['maxWidth']; top: string }
}

interface ModalButtonProps {
  label: string
  cb: () => void
  color?: ButtonProps['color']
}

const ModalButton = (props: ModalButtonProps) => {
  return (
    <Button
      variant="contained"
      color={props.color || 'secondary'}
      aria-label={props.label}
      onClick={() => props.cb()}
    >
      {props.label}
    </Button>
  )
}

export const ModalWrapper = (props: ModalProps) => {
  const { onCancel, onSubmit, customButton, styleOverrides } = props
  return (
    <>
      <Dialog
        open={props.open}
        onClose={props.onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        fullWidth={true}
        maxWidth={styleOverrides?.size || 'lg'}
        sx={{ top: styleOverrides?.top || '-25%' }}
      >
        <DialogTitle>{props.header}</DialogTitle>
        <DialogContent dividers>{props.content}</DialogContent>
        <DialogActions>
          {customButton && <ModalButton {...customButton} />}
          {onCancel && <ModalButton label="Cancel" cb={onCancel} />}
          {onSubmit && (
            <ModalButton label="Submit" color="primary" cb={onSubmit} />
          )}
        </DialogActions>
      </Dialog>
    </>
  )
}
