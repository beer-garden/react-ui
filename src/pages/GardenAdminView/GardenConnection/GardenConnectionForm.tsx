import { Box, Button, Divider } from '@mui/material'
import { Form, Formik } from 'formik'
import { useState } from 'react'
import { Garden } from '../garden-admin-view-types'
import ConnectionHttpValues from './form-components/ConnectionHttpValues'
import ConnectionMethod from './form-components/ConnectionMethod'
import ConnectionStompValues from './form-components/ConnectionStompValues'
import SubmissionStatusSnackbar from './form-components/SubmissionStatusSnackbar'
import {
  connectionInitialValues,
  connectionValidationSchema,
} from './garden-connection-form-params'
import useGardenConnectionFormOnSubmit from './hooks/useGardenConnectionFormOnSubmit'

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
    <Box>
      <Formik
        initialValues={connectionInitialValues(conxType, conxParms)}
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
    </Box>
  )
}

export default GardenConnectionForm
