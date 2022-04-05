import { System } from '../../types/custom_types'

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
  heartbeat?: string
}

export interface GardenConnectionParameters {
  http?: HttpConnectionParameters
  stomp?: StompConnectionParameters
}

interface HttpConnectionParameters {
  host?: string
  port?: number
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
  port?: number
  send_destination?: string
  subscribe_destination?: string
  username?: string
  password?: string
  ssl?: StompSsl
  headers: StompHeader[]
}

interface StompHeader {
  key: string
  value: string
}

interface StompSsl {
  use_ssl: boolean
}
