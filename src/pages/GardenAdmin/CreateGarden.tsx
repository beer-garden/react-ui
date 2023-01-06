import { Box, Button, Dialog } from '@mui/material'
import { GardenConnectionForm } from 'components/GardenConnectionForm'
import useGardens from 'hooks/useGardens'
import { Dispatch, SetStateAction, useState } from 'react'
import { Garden } from 'types/backend-types'
import { SnackbarState } from 'types/custom-types'

interface GardenConnectionFormProps {
  setRequestStatus: Dispatch<SetStateAction<SnackbarState | undefined>>
}

const CreateGarden = ({ setRequestStatus }: GardenConnectionFormProps) => {
  const [open, setOpen] = useState(false)
  const garden: Garden = {
    connection_params: { http: undefined, stomp: undefined },
    connection_type: 'HTTP',
    name: '',
    namespaces: [],
    status: '',
    systems: [],
  }

  const { createGarden } = useGardens()

  const formOnSubmit = (garden: Garden) => {
    createGarden(garden)
      .then(() => {
        setRequestStatus({
          severity: 'success',
          message: `Garden: ${garden.name} successfully created`,
          showSeverity: false,
        })
        setOpen(false)
      })
      .catch((error) => {
        console.error('ERROR', error)

        if (error.response && error.response.statusText) {
          setRequestStatus({
            severity: 'error',
            message: `${error.response.status} ${error.response.statusText}`,
            doNotAutoDismiss: true,
          })
        } else {
          setRequestStatus({
            severity: 'error',
            message: `${error}`,
            doNotAutoDismiss: true,
          })
        }
      })
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
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        maxWidth={'md'}
      >
        <GardenConnectionForm
          garden={garden}
          title="Create Garden"
          formOnSubmit={formOnSubmit}
          includeGardenName={true}
        />
      </Dialog>
    </Box>
  )
}

export { CreateGarden }
