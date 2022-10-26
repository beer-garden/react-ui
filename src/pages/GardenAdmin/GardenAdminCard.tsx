import {
  AppBar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Modal,
  Toolbar,
  Typography,
} from '@mui/material'
import { Divider } from 'components/Divider'
import { GardenStatusAlert } from 'components/GardenStatusAlert'
import { PermissionsContainer } from 'containers/PermissionsContainer'
import useGardens from 'hooks/useGardens'
import { Dispatch, SetStateAction, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Garden } from 'types/backend-types'
import { SnackbarState } from 'types/custom-types'

interface GardenAdminCardProps {
  garden: Garden
  setRequestStatus: Dispatch<SetStateAction<SnackbarState | undefined>>
}

const GardenAdminCard = ({
  garden,
  setRequestStatus,
}: GardenAdminCardProps) => {
  const [open, setOpen] = useState(false)

  const { deleteGarden } = useGardens()
  const { hasPermission } = PermissionsContainer.useContainer()

  const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    height: 'auto',
    overflow: 'auto',
  }

  const handleDeleteClick = () => {
    deleteGarden(garden.name)
      .then(() => {
        setRequestStatus({
          severity: 'success',
          message: `Garden: ${garden.name} successful removed`,
          showSeverity: false,
        })
        setOpen(false)
      })
      .catch((error) => {
        console.error('ERROR', error)

        if (error.response) {
          setRequestStatus({
            severity: 'error',
            message: `${error.response.data.message}`,
            doNotAutoDismiss: true,
          })
        } else {
          setRequestStatus({
            severity: 'error',
            message: `${error}`,
          })
        }
      })
  }

  return (
    <Card sx={{ minWidth: 275 }}>
      <AppBar color="inherit" position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            {garden.name}{' '}
            {garden.connection_type === 'LOCAL' ? '(LOCAL)' : '(REMOTE)'}
          </Typography>
        </Toolbar>
      </AppBar>
      <CardContent>
        <Grid container>
          <Grid>
            <Box sx={{ mr: 1 }}>Status: </Box>
          </Grid>
          <Grid>
            <GardenStatusAlert status={garden.status} />
          </Grid>
        </Grid>
        Namespaces: {garden.namespaces.length} <br /> Systems:{' '}
        {garden.systems.length}
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          color="secondary"
          component={RouterLink}
          to={'/admin/gardens/' + garden.name}
          sx={{ width: 0.75, mr: 1 }}
        >
          Edit configurations
        </Button>
        {garden.connection_type !== 'LOCAL' ? (
          <>
            {hasPermission('garden:delete') && (
              <Button
                variant="contained"
                color="error"
                onClick={() => setOpen(true)}
              >
                Delete
              </Button>
            )}

            <Modal
              open={open}
              onClose={() => setOpen(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={modalStyle}>
                Confirm Garden Deletion
                <Divider />
                Are you sure you want to delete garden: {garden.name}? This will
                also delete all Systems associated with garden: {garden.name}.
                <Divider />
                <Button
                  onClick={() => handleDeleteClick()}
                  variant="contained"
                  color="secondary"
                  sx={{ mr: 1 }}
                >
                  Confirm
                </Button>
                <Button
                  onClick={() => setOpen(false)}
                  variant="contained"
                  color="error"
                >
                  Cancel
                </Button>
              </Box>
            </Modal>
          </>
        ) : null}
      </CardActions>
    </Card>
  )
}

export { GardenAdminCard }
