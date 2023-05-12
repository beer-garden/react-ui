import {
  AppBar,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Toolbar,
  Typography,
} from '@mui/material'
import { LabeledData } from 'components/LabeledData'
import { ModalWrapper } from 'components/ModalWrapper'
import { PermissionsContainer } from 'containers/PermissionsContainer'
import useGardens from 'hooks/useGardens'
import { useMountedState } from 'hooks/useMountedState'
import { Link as RouterLink } from 'react-router-dom'
import { Garden } from 'types/backend-types'
import { SnackbarState } from 'types/custom-types'

interface GardenAdminCardProps {
  garden: Garden
  setRequestStatus: (arg0: SnackbarState) => void
}

const GardenAdminCard = ({
  garden,
  setRequestStatus,
}: GardenAdminCardProps) => {
  const [open, setOpen] = useMountedState<boolean>(false)

  const { deleteGarden } = useGardens()
  const { hasGardenPermission } = PermissionsContainer.useContainer()

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
    <Card>
      <AppBar color="inherit" position="static">
        <Toolbar>
          <Typography variant="h3" color="inherit">
            {garden.name}{' '}
            {garden.connection_type === 'LOCAL' ? '(LOCAL)' : '(REMOTE)'}
          </Typography>
        </Toolbar>
      </AppBar>
      <CardContent>
        <Grid
          container
          spacing={4}
        >
          <Grid item >
            <LabeledData label="Status" data={garden.status} alert />
          </Grid>
          <Grid item >
            <LabeledData label="Namespaces" data={garden.namespaces.length} />
          </Grid>
          <Grid item >
            <LabeledData label="Systems" data={garden.systems.length} />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        {hasGardenPermission('garden:update', garden) && (
          <Button
            variant="contained"
            color="primary"
            component={RouterLink}
            to={'/admin/gardens/' + garden.name}
            sx={{ width: 0.75, mr: 1 }}
          >
            Edit configurations
          </Button>
        )}
        {garden.connection_type !== 'LOCAL' &&
        hasGardenPermission('garden:delete', garden) ? (
          <Button
            variant="contained"
            color="error"
            onClick={() => setOpen(true)}
          >
            Delete
          </Button>
        ) : null}
      </CardActions>
      <ModalWrapper
        open={open}
        header="Confirm Garden Deletion"
        onClose={() => setOpen(false)}
        onSubmit={() => handleDeleteClick()}
        onCancel={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        styleOverrides={{ size: 'sm', top: '-55%' }}
        content={
          <Typography variant="body1">
            {`Are you sure you want to delete garden: ${garden.name}? This
                  will also delete all Systems associated with garden: 
                  ${garden.name}.`}
          </Typography>
        }
      />
    </Card>
  )
}

export { GardenAdminCard }
