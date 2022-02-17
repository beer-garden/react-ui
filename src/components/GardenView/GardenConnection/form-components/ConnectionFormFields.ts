export interface ConnectionFormFields {
  readonly [index: string]: string | number | boolean | StompHeader[]

  connectionType: string

  httpCACert: string
  httpCAVerify: boolean
  httpClientCert: string
  httpHost: string
  httpPort: number
  httpSsl: boolean
  httpUrlPrefix: string

  stompHost: string
  stompPort: number
  stompSendDestination: string
  stompSubscribeDestination: string
  stompUsername: string
  stompPassword: string
  stompSsl: boolean
  stompHeaders: StompHeader[]
}

export interface StompHeader {
  id: string
  key: string
  value: string
}
