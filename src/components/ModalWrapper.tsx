import { Box, Button, Modal } from '@mui/material'
import Divider from 'components/divider'
import PageHeader from 'components/PageHeader'

interface ModalProps {
  header: string
  open: boolean
  content: JSX.Element
  onClose: () => void
  onSubmit?: () => void
  onCancel?: () => void
  customButton?: ModalButtonProps
  styleOverrides?: { [key: string]: string | number }
}

interface ModalButtonProps {
  label: string
  cb: () => void
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.default',
  border: '1px solid #000',
  boxShadow: 24,
  width: '60%',
  p: 2,
}

const ModalButton = (props: ModalButtonProps) => {
  return (
    <Button
      style={{ float: 'right', margin: '5px 5px 0 0' }}
      variant="contained"
      color="primary"
      aria-label={props.label}
      onClick={() => props.cb()}
    >
      {props.label}
    </Button>
  )
}

export const ModalWrapper = (props: ModalProps) => {
  const { onCancel, onSubmit, customButton } = props
  return (
    <>
      <Modal
        open={props.open}
        onClose={props.onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={Object.assign(style, props.styleOverrides)}>
          <PageHeader title={props.header} description="" />
          <Divider />
          {props.content}
          <Divider />
          {onSubmit && <ModalButton label="Submit" cb={onSubmit} />}
          {onCancel && <ModalButton label="Cancel" cb={onCancel} />}
          {customButton && <ModalButton {...customButton} />}
        </Box>
      </Modal>
    </>
  )
}
