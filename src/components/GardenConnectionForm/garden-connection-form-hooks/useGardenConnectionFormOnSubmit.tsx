import { FormikHelpers } from 'formik'
import { Garden } from 'types/backend-types'
import {
  ConnectionFormFields,
  StompHeader,
} from 'types/garden-connection-form-types'

/**
 * Return a function to use as the onSubmit for Formik
 * @param garden
 * @param formOnSubmit
 * @returns An onSubmit function
 */
const useGardenConnectionFormOnSubmit = (
  garden: Garden,
  formOnSubmit: (garden: Garden) => void,
) => {
  return (
    connectionParams: ConnectionFormFields,
    formikActions: FormikHelpers<ConnectionFormFields>,
  ) => {
    formOnSubmit(updateConnection(connectionParams, garden))
    formikActions.setSubmitting(false)
  }
}

export { useGardenConnectionFormOnSubmit }

/**
 * Update a garden with new connection parameters.
 * @param connectionParams
 * @param garden
 * @returns Updated garden
 */
const updateConnection = (
  connectionParams: ConnectionFormFields,
  garden: Garden,
) => {
  const { gardenName, connectionType, ...params } = connectionParams

  return {
    ...garden,
    name: gardenName,
    connection_type: connectionType,
    connection_params: getConnectionParams(params),
  }
}

/**
 * Translate Formik form's data into connection parameters for beergarden
 *
 * @param methodParams
 * @returns Connection parameters for beergarden
 */
const getConnectionParams = (
  methodParams: Omit<ConnectionFormFields, 'connectionType'>,
) => {
  return {
    http: {
      host: methodParams.httpHost,
      port: methodParams.httpPort,
      ca_verify: methodParams.httpCAVerify,
      ssl: methodParams.httpSsl,
      url_prefix: methodParams.httpUrlPrefix,
      ca_cert: methodParams.httpCACert,
      client_cert: methodParams.httpClientCert,
      username: methodParams.httpUsername,
      password: methodParams.httpPassword,
    },
    stomp: {
      host: methodParams.stompHost,
      port: methodParams.stompPort,
      send_destination: methodParams.stompSendDestination,
      subscribe_destination: methodParams.stompSubscribeDestination,
      username: methodParams.stompUsername,
      password: methodParams.stompPassword,
      ssl: {
        use_ssl: methodParams.stompUseSsl,
        ca_cert: methodParams.stompCACert,
        client_cert: methodParams.stompClientCert,
        client_key: methodParams.stompClientKey,
      },
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
