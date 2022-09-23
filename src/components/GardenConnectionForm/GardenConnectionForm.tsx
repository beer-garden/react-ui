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
import { Form, Formik } from 'formik'
import { GardenConnectionParameters } from 'pages/GardenAdminView'
import { useState } from 'react'
import { Garden } from 'types/backend-types'
import { SnackbarState } from 'types/custom-types'

export interface SubmissionStatusState {
  result: 'success' | 'failure'
  msg?: string
}

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

  const title = isCreateGarden ? 'Create Garden' : 'Update Connection'

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
          <Typography variant="h6">{title}</Typography>
          {isCreateGarden ? <GardenName /> : null}
          <ConnectionMethod />
          <Divider sx={{ mt: 2, mb: 1 }} />
          <Box sx={{ p: 1 }}>
            <ConnectionHttpValues />
            <Divider sx={{ mt: 2, mb: 1 }} />
            <ConnectionStompValues />
          </Box>
          <Button color="primary" variant="contained" fullWidth type="submit">
            {title}
          </Button>
        </Form>
      </Formik>
      {submissionStatus ? <Snackbar status={submissionStatus} /> : null}
    </>
  )
}

export { GardenConnectionForm }
