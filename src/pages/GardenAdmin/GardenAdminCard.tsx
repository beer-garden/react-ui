import {
  AppBar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Toolbar,
  Typography,
} from '@mui/material'
import { LabeledData } from 'components/LabeledData'
import { ModalWrapper } from 'components/ModalWrapper'
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
    <Card sx={{ minWidth: 275 }}>
      <AppBar color="inherit" position="static">
        <Toolbar>
          <Typography variant="h3" color="inherit">
            {garden.name}{' '}
            {garden.connection_type === 'LOCAL' ? '(LOCAL)' : '(REMOTE)'}
          </Typography>
        </Toolbar>
      </AppBar>
      <CardContent>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, 180px)',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <LabeledData label="Status" data={garden.status} alert />
          <LabeledData label="Namespaces" data={garden.namespaces.length} />
          <LabeledData label="Systems" data={garden.systems.length} />
        </Box>
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
