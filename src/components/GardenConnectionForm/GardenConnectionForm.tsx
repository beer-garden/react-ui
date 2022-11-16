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
import { PermissionsContainer } from 'containers/PermissionsContainer'
import { Form, Formik } from 'formik'
import { GardenConnectionParameters } from 'pages/GardenAdminView'
import { Garden } from 'types/backend-types'

interface GardenConnectionFormProps {
  garden: Garden
  title: string
  formOnSubmit: (garden: Garden) => void
  includeGardenName?: boolean
}

const GardenConnectionForm = ({
  garden,
  title,
  formOnSubmit,
  includeGardenName,
}: GardenConnectionFormProps) => {
  const {
    connection_type: conxType,
    connection_params: conxParms,
    name: conxName,
  } = garden
  const { hasPermission } = PermissionsContainer.useContainer()

  return (
    <>
      <Formik
        initialValues={connectionInitialValues(
          conxName,
          conxType,
          conxParms as GardenConnectionParameters,
        )}
        validationSchema={connectionValidationSchema}
        onSubmit={useGardenConnectionFormOnSubmit(garden, formOnSubmit)}
      >
        <Form>
          <fieldset disabled={!hasPermission('garden:update')}>
            <Typography variant="h6">{title}</Typography>
            {includeGardenName ? <GardenName /> : null}
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
    </>
  )
}

export { GardenConnectionForm }
