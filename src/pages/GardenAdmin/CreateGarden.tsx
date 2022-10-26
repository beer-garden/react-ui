import { Box, Button, Modal } from '@mui/material'
import { GardenConnectionForm } from 'components/GardenConnectionForm'
import { useState } from 'react'
import { Garden } from 'types/backend-types'

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  height: '99%',
  overflow: 'auto',
}

const CreateGarden = () => {
  const [open, setOpen] = useState(false)
  const garden: Garden = {
    connection_params: { http: undefined, stomp: undefined },
    connection_type: 'HTTP',
    name: '',
    namespaces: [],
    status: '',
    systems: [],
  }
  return (
    <Box style={{ float: 'right' }}>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setOpen(true)}
      >
        Create Garden
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <GardenConnectionForm garden={garden} isCreateGarden={true} />
        </Box>
      </Modal>
    </Box>
  )
}

export { CreateGarden }
