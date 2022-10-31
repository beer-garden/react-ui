import { System } from 'types/backend-types'

export interface Garden {
  id?: string
  name: string
  status: string
  status_info?: Status
  namespaces: string[]
  systems: System[]
  connection_type: string
  connection_params: GardenConnectionParameters
}

interface Status {
  heartbeat?: number
}

export interface GardenConnectionParameters {
  name?: string
  http?: HttpConnectionParameters
  stomp?: StompConnectionParameters
}

interface HttpConnectionParameters {
  host?: string
  port?: number | undefined
  url_prefix?: string
  ssl?: boolean
  ca_cert?: string
  ca_verify?: boolean
  client_cert?: string
  username?: string
  password?: string
}

interface StompConnectionParameters {
  host?: string
  port?: number | undefined
  send_destination?: string
  subscribe_destination?: string
  username?: string
  password?: string
  use_ssl: boolean
  ca_cert?: string
  client_cert?: string
  client_key?: string
  headers: StompHeader[]
}

interface StompHeader {
  key: string
  value: string
}

export interface StompSsl {
  ca_cert?: string
  client_cert?: string
  client_key?: string
  use_ssl: boolean
}
