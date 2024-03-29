import { Button, Dialog } from '@mui/material'
import { GardenConnectionForm } from 'components/GardenConnectionForm'
import useGardens from 'hooks/useGardens'
import { useMountedState } from 'hooks/useMountedState'
import { Garden } from 'types/backend-types'
import { SnackbarState } from 'types/custom-types'

interface GardenConnectionFormProps {
  setRequestStatus: (arg0: SnackbarState) => void
}

const CreateGarden = ({ setRequestStatus }: GardenConnectionFormProps) => {
  const [open, setOpen] = useMountedState<boolean>(false)
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
    <>
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
        PaperProps={{sx: {p: 1}}}
      >
        <GardenConnectionForm
          garden={garden}
          title="Create Garden"
          formOnSubmit={formOnSubmit}
          includeGardenName={true}
        />
      </Dialog>
    </>
  )
}

export { CreateGarden }
