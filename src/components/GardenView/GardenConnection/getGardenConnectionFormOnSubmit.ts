import { FormikHelpers } from 'formik'
import { Garden } from '../garden-view-types'
import {
  ConnectionFormFields,
  StompHeader,
} from './form-components/ConnectionFormFields'
import axios from 'axios'
import { Dispatch, SetStateAction } from 'react'
import { SubmissionStatusState } from './GardenConnectionForm'

/**
 * Return a function to use as the onSubmit for Formik
 * @param garden
 * @param  setSubmissionStatus
 * @returns An onSubmit function
 */
const getGardenConnectionFormOnSubmit = (
  garden: Garden,
  setSubmissionStatus: Dispatch<
    SetStateAction<SubmissionStatusState | undefined>
  >
) => {
  return (
    connectionParams: ConnectionFormFields,
    formikActions: FormikHelpers<ConnectionFormFields>
  ) => {
    axios
      .patch(
        '/api/v1/gardens/' + encodeURIComponent(garden.name),
        {
          operation: 'config',
          path: '',
          value: updateConnection(connectionParams, garden),
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      )
      .then(() => setSubmissionStatus({ result: 'success' }))
      .catch((err) => {
        setSubmissionStatus({
          result: 'failure',
          msg: `${err.response.status} ${err.response.statusText}`,
        })
        console.log('ERROR', err)
      })

    formikActions.setSubmitting(false)
  }
}

export default getGardenConnectionFormOnSubmit

/**
 * Update a garden with new connection parameters.
 * @param connectionParams
 * @param garden
 * @returns Updated garden
 */
const updateConnection = (
  connectionParams: ConnectionFormFields,
  garden: Garden
) => {
  const { connectionType, ...params } = connectionParams

  return {
    ...garden,
    connection_type: connectionType,
    connection_params: getConnectionParams(params),
  }
}

/**
 * Translate Formik form's data into connection parameters for beergarden
 * @param methodParams
 * @returns Connection parameters for beergarden
 */
const getConnectionParams = (
  methodParams: Omit<ConnectionFormFields, 'connectionType'>
) => {
  return {
    http: {
      ca_verify: methodParams.httpCAVerify,
      port: methodParams.httpPort,
      ssl: methodParams.httpSsl,
      url_prefix: methodParams.httpUrlPrefix,
      ca_cert: methodParams.httpCACert,
      client_cert: methodParams.httpClientCert,
    },
    stomp: {
      host: methodParams.stompHost,
      port: methodParams.stompPort,
      send_destination: methodParams.stompSendDestination,
      subscribe_destination: methodParams.stompSubscribeDestination,
      username: methodParams.stompUsername,
      password: methodParams.stompPassword,
      ssl: { use_ssl: methodParams.stompSsl },
      headers: (methodParams.stompHeaders as StompHeader[]).map(deIdifyHeader),
    },
  }
}

/**
 * Strip the id field from a stomp header
 * @param param0
 * @returns Stripped stomp header
 */
const deIdifyHeader = ({
  key,
  value,
}: StompHeader): Omit<StompHeader, 'id'> => ({
  key: key,
  value: value,
})
