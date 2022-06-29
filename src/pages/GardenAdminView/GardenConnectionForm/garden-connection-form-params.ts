import { nanoid } from 'nanoid/non-secure'
import { GardenConnectionParameters } from 'pages/GardenAdminView'
import * as Yup from 'yup'

/**
 * Convert beergarden connection parameters into our preferred format
 * @param conxType
 * @param conxParms
 * @returns
 */
export const connectionInitialValues = (
  conxType: string,
  conxParms: GardenConnectionParameters,
) => {
  return {
    connectionType: conxType ?? 'HTTP',
    httpCACert: conxParms.http?.ca_cert ?? '',
    httpCAVerify: conxParms.http?.ca_verify ?? false,
    httpClientCert: conxParms.http?.client_cert ?? '',
    httpHost: conxParms.http?.host ?? '',
    httpPort: conxParms.http?.port ?? 0,
    httpSsl: conxParms.http?.ssl ?? false,
    httpUrlPrefix: conxParms.http?.url_prefix ?? '',
    httpUsername: conxParms.http?.username ?? '',
    httpPassword: conxParms.http?.password ?? '',
    stompHost: conxParms.stomp?.host ?? '',
    stompPort: conxParms.stomp?.port ?? 0,
    stompSendDestination: conxParms.stomp?.send_destination ?? '',
    stompSubscribeDestination: conxParms.stomp?.subscribe_destination ?? '',
    stompUsername: conxParms.stomp?.username ?? '',
    stompPassword: conxParms.stomp?.password ?? '',
    stompSsl: conxParms.stomp?.ssl?.use_ssl ?? false,
    stompHeaders: (conxParms.stomp?.headers ?? []).map(idifyHeader),
  }
}

const idifyHeader = (element: { key: string; value: string }) => {
  return {
    id: nanoid(),
    ...element,
  }
}

export const connectionValidationSchema = () =>
  Yup.object().shape({
    connectionType: Yup.string(),
    httpCACert: Yup.string(),
    httpCAVerify: Yup.boolean(),
    httpClientCert: Yup.string(),
    httpHost: Yup.string(),
    httpPort: Yup.number()
      .integer('Port must be an integer')
      .positive('Port must be positive'),
    httpSsl: Yup.boolean(),
    httpUrlPrefix: Yup.string(),
    httpUsername: Yup.string(),
    httpPassword: Yup.string(),
    stompHost: Yup.string(),
    stompPort: Yup.number()
      .integer('Port must be an integer')
      .positive('Port must be positive'),
    stompSendDestination: Yup.string(),
    stompSubscribeDestination: Yup.string(),
    stompUsername: Yup.string(),
    stompPassword: Yup.string(),
    stompSsl: Yup.boolean(),
    stompHeaders: Yup.array().of(
      Yup.object().shape({
        key: Yup.string().required('Key cannot be empty'),
        value: Yup.string().required('Value cannot be empty'),
      }),
    ),
  })
