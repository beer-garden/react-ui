import { Box, Button, Modal } from '@mui/material'
import Divider from 'components/divider'
import PageHeader from 'components/PageHeader'

interface ModalProps {
  header: string
  open: boolean
  content: JSX.Element
  onClose(): void
  onCancel(): void
  onSubmit(): void
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  width: '50%',
  p: 2,
}

export const ModalWrapper = (props: ModalProps) => {
  return (
    <>
      <Modal
        open={props.open}
        onClose={props.onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <PageHeader title={props.header} description="" />
          <Divider />
          {props.content}
          <Divider />
          <Button
            style={{ float: 'right' }}
            variant="contained"
            color="primary"
            aria-label="cancel"
            onClick={() => props.onCancel()}
          >
            Cancel
          </Button>
          <Button
            style={{ float: 'right' }}
            variant="contained"
            color="primary"
            aria-label="Submit"
            onClick={() => props.onSubmit()}
          >
            Submit
          </Button>
        </Box>
      </Modal>
    </>
  )
}
