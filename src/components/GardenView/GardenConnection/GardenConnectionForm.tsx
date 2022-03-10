import { Box, Button, Divider } from '@mui/material'
import { Form, Formik } from 'formik'
import { FC, useState } from 'react'
import { Garden } from '../garden-view-types'
import ConnectionHttpValues from './form-components/ConnectionHttpValues'
import ConnectionMethod from './form-components/ConnectionMethod'
import ConnectionStompValues from './form-components/ConnectionStompValues'
import SubmissionStatusSnackbar from './form-components/SubmissionStatusSnackbar'
import {
  connectionInitialValues,
  connectionValidationSchema,
} from './garden-connection-form-params'
import getGardenConnectionFormOnSubmit from './getGardenConnectionFormOnSubmit'

interface Props {
  garden: Garden
}

const GardenConnectionForm: FC<Props> = ({ garden }) => {
  const { connection_type: conxType, connection_params: conxParms } = garden
  const [submissionStatus, setSubmissionStatus] = useState<
    SubmissionStatusState | undefined
  >(undefined)

  return (
    <Box>
      <Formik
        initialValues={connectionInitialValues(conxType, conxParms)}
        validationSchema={connectionValidationSchema}
        onSubmit={getGardenConnectionFormOnSubmit(garden, setSubmissionStatus)}
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

export interface SubmissionStatusState {
  result: 'success' | 'failure'
  msg?: string
}
