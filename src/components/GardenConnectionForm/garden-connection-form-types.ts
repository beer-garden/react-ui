export interface ConnectionFormFields {
  readonly [index: string]:
    | string
    | number
    | boolean
    | undefined
    | StompHeader[]

  connectionType: string

  gardenName: string

  httpCACert: string
  httpCAVerify: boolean
  httpClientCert: string
  httpHost: string
  httpPort: number | undefined
  httpSsl: boolean
  httpUrlPrefix: string
  httpUsername: string
  httpPassword: string

  stompHost: string
  stompPort: number | undefined
  stompSendDestination: string
  stompSubscribeDestination: string
  stompUsername: string
  stompPassword: string
  stompUseSsl: boolean
  stompCACert: string | undefined
  stompClientCert: string | undefined
  stompClientKey: string | undefined
  stompHeaders: StompHeader[]
}

export interface StompHeader {
  id: string
  key: string
  value: string
}
