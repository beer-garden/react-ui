import { nanoid } from 'nanoid/non-secure'
import { GardenConnectionParameters } from 'types/garden-admin-view-types'
import * as Yup from 'yup'

/**
 * Convert beergarden connection parameters into our preferred format
 * @param conxName
 * @param conxType
 * @param conxParms
 * @returns
 */
export const connectionInitialValues = (
  conxName: string,
  conxType: string,
  conxParms: GardenConnectionParameters,
) => {
  return {
    gardenName: conxName ?? '',
    connectionType: conxType ?? 'HTTP',
    httpCACert: conxParms.http?.ca_cert ?? '',
    httpCAVerify: conxParms.http?.ca_verify ?? false,
    httpClientCert: conxParms.http?.client_cert ?? '',
    httpHost: conxParms.http?.host ?? '',
    httpPort: conxParms.http?.port ?? undefined,
    httpSsl: conxParms.http?.ssl ?? false,
    httpUrlPrefix: conxParms.http?.url_prefix ?? '',
    httpUsername: conxParms.http?.username ?? '',
    httpPassword: conxParms.http?.password ?? '',
    stompHost: conxParms.stomp?.host ?? '',
    stompPort: conxParms.stomp?.port ?? undefined,
    stompSendDestination: conxParms.stomp?.send_destination ?? '',
    stompSubscribeDestination: conxParms.stomp?.subscribe_destination ?? '',
    stompUsername: conxParms.stomp?.username ?? '',
    stompPassword: conxParms.stomp?.password ?? '',
    stompUseSsl: conxParms.stomp?.use_ssl ?? false,
    stompCACert: conxParms.stomp?.ca_cert ?? undefined,
    stompClientCert: conxParms.stomp?.client_cert ?? undefined,
    stompClientKey: conxParms.stomp?.client_key ?? undefined,
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
    gardenName: Yup.string().required(),
    connectionType: Yup.string().required(),
    httpCACert: Yup.string().when('connectionType', {
      is: 'HTTP',
      then: Yup.string().when('httpSsl', {
        is: true,
        then: Yup.string().notOneOf(['']).required(),
      }),
    }),
    httpCAVerify: Yup.boolean(),
    httpClientCert: Yup.string().when('connectionType', {
      is: 'HTTP',
      then: Yup.string().when('httpSsl', {
        is: true,
        then: Yup.string().notOneOf(['']).required(),
      }),
    }),
    httpHost: Yup.string().when('connectionType', {
      is: 'HTTP',
      then: Yup.string().notOneOf(['']).required(),
    }),
    httpPort: Yup.number().when('connectionType', {
      is: 'HTTP',
      then: Yup.number()
        .integer('Port must be an integer')
        .positive('Port must be positive')
        .required(),
    }),
    httpSsl: Yup.boolean(),
    httpUrlPrefix: Yup.string(),
    httpUsername: Yup.string(),
    httpPassword: Yup.string(),
    stompHost: Yup.string().when('connectionType', {
      is: 'STOMP',
      then: Yup.string().notOneOf(['']).required(),
    }),
    stompPort: Yup.number().when('connectionType', {
      is: 'STOMP',
      then: Yup.number()
        .integer('Port must be an integer')
        .positive('Port must be positive')
        .required(),
    }),
    stompSendDestination: Yup.string().when('connectionType', {
      is: 'STOMP',
      then: Yup.string().notOneOf(['']).required(),
    }),
    stompSubscribeDestination: Yup.string().when('connectionType', {
      is: 'STOMP',
      then: Yup.string().notOneOf(['']).required(),
    }),
    stompUsername: Yup.string(),
    stompPassword: Yup.string(),
    stompUseSsl: Yup.boolean(),
    stompCACert: Yup.string().when('connectionType', {
      is: 'STOMP',
      then: Yup.string().when('stompUseSsl', {
        is: true,
        then: Yup.string().notOneOf(['']).required(),
      }),
    }),
    stompClientCert: Yup.string().when('connectionType', {
      is: 'STOMP',
      then: Yup.string().when('stompUseSsl', {
        is: true,
        then: Yup.string().notOneOf(['']).required(),
      }),
    }),
    stompClientKey: Yup.string().when('connectionType', {
      is: 'STOMP',
      then: Yup.string().when('stompUseSsl', {
        is: true,
        then: Yup.string().notOneOf(['']).required(),
      }),
    }),
    stompHeaders: Yup.array().of(
      Yup.object().shape({
        key: Yup.string().required('Key cannot be empty'),
        value: Yup.string().required('Value cannot be empty'),
      }),
    ),
  })
