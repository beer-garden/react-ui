import { Box, Button, Modal } from '@mui/material'
import Divider from 'components/divider'
import PageHeader from 'components/PageHeader'

interface ModalProps {
  header: string
  open: boolean
  content: JSX.Element
  styleOverrides: { [key: string]: string | number }
  onClose(): void
  onCancel(): void
  onSubmit(): void
}

const style = {
  position: 'absolute',
  transform: 'translate(100%, 100%)',
  bgcolor: 'background.default',
  border: '1px solid #000',
  boxShadow: 24,
  width: '60%',
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
        <Box sx={Object.assign(style, props.styleOverrides)}>
          <PageHeader title={props.header} description="" />
          <Divider />
          {props.content}
          <Divider />
          <Button
            style={{ float: 'right', margin: '5px 5px 0 0' }}
            variant="contained"
            color="primary"
            aria-label="Submit"
            onClick={() => props.onSubmit()}
          >
            Submit
          </Button>
          <Button
            style={{ float: 'right', margin: '5px 5px 0 0' }}
            variant="contained"
            color="secondary"
            aria-label="cancel"
            onClick={() => props.onCancel()}
          >
            Cancel
          </Button>
        </Box>
      </Modal>
    </>
  )
}
