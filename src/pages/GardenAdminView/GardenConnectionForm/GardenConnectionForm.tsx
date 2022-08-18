import { Box, Button, Divider } from '@mui/material'
import { Form, Formik } from 'formik'
import {
  ConnectionHttpValues,
  connectionInitialValues,
  ConnectionMethod,
  ConnectionStompValues,
  connectionValidationSchema,
  GardenConnectionParameters,
  // Garden,
  SubmissionStatusSnackbar,
  useGardenConnectionFormOnSubmit,
} from 'pages/GardenAdminView'
import { useState } from 'react'
import { Garden } from 'types/backend-types'

export interface SubmissionStatusState {
  result: 'success' | 'failure'
  msg?: string
}

interface GardenConnectionFormProps {
  garden: Garden
}

const GardenConnectionForm = ({ garden }: GardenConnectionFormProps) => {
  const { connection_type: conxType, connection_params: conxParms } = garden
  const [submissionStatus, setSubmissionStatus] = useState<
    SubmissionStatusState | undefined
  >(undefined)

  return (
    <>
      <Formik
        initialValues={connectionInitialValues(
          conxType,
          conxParms as GardenConnectionParameters,
        )}
        validationSchema={connectionValidationSchema}
        onSubmit={useGardenConnectionFormOnSubmit(garden, setSubmissionStatus)}
      >
        <Form>
          <ConnectionMethod />
          <Divider sx={{ mt: 2, mb: 1 }} />
          <Box sx={{ p: 1 }}>
            <ConnectionHttpValues />
            <Divider sx={{ mt: 2, mb: 1 }} />
            <ConnectionStompValues />
          </Box>
          <Button color="primary" variant="contained" fullWidth type="submit">
            Update Connection
          </Button>
        </Form>
      </Formik>
      {submissionStatus ? (
        <SubmissionStatusSnackbar
          status={submissionStatus as SubmissionStatusState}
        />
      ) : null}
    </>
  )
}

export { GardenConnectionForm }
