import { Box, Button, Divider, Typography } from '@mui/material'
import {
  ConnectionHttpValues,
  connectionInitialValues,
  ConnectionMethod,
  ConnectionStompValues,
  connectionValidationSchema,
  GardenName,
  useGardenConnectionFormOnSubmit,
} from 'components/GardenConnectionForm'
import { Snackbar } from 'components/Snackbar'
import { PermissionsContainer } from 'containers/PermissionsContainer'
import { Form, Formik } from 'formik'
import { GardenConnectionParameters } from 'pages/GardenAdminView'
import { useState } from 'react'
import { Garden } from 'types/backend-types'
import { SnackbarState } from 'types/custom-types'

interface GardenConnectionFormProps {
  garden: Garden
  isCreateGarden?: boolean
}

const GardenConnectionForm = ({
  garden,
  isCreateGarden,
}: GardenConnectionFormProps) => {
  const {
    connection_type: conxType,
    connection_params: conxParms,
    name: conxName,
  } = garden
  const [submissionStatus, setSubmissionStatus] = useState<
    SnackbarState | undefined
  >(undefined)
  const { hasPermission } = PermissionsContainer.useContainer()

  const title = isCreateGarden
    ? 'Create Garden'
    : 'Update Connection Information'

  return (
    <>
      <Formik
        initialValues={connectionInitialValues(
          conxName,
          conxType,
          conxParms as GardenConnectionParameters,
        )}
        validationSchema={connectionValidationSchema}
        onSubmit={useGardenConnectionFormOnSubmit(
          garden,
          setSubmissionStatus,
          isCreateGarden,
        )}
      >
        <Form>
          <fieldset disabled={!hasPermission('garden:update')}>
            <Typography variant="h6">{title}</Typography>
            {isCreateGarden ? <GardenName /> : null}
            <ConnectionMethod />
            <Divider sx={{ mt: 2, mb: 1 }} />
            <Box sx={{ p: 1 }}>
              <ConnectionHttpValues />
              <Divider sx={{ mt: 2, mb: 1 }} />
              <ConnectionStompValues />
            </Box>
            {hasPermission('garden:update') && (
              <Button
                color="secondary"
                variant="contained"
                fullWidth
                type="submit"
              >
                {title}
              </Button>
            )}
          </fieldset>
        </Form>
      </Formik>
      {submissionStatus ? <Snackbar status={submissionStatus} /> : null}
    </>
  )
}

export { GardenConnectionForm }
