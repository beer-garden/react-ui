import { AxiosRequestConfig } from 'axios'
import { RequestsSearchApi } from './request-types'

enum ActionKind {
  UPDATE_URL = 'UPDATE_URL',
  UPDATE_CONFIG = 'UPDATE_CONFIG',
  UPDATE_SEARCH_API = 'UPDATE_SEARCH_API',
}

type UrlPayload = string
type ConfigPayload = AxiosRequestConfig
type ApiPayload = RequestsSearchApi
type PayloadType = UrlPayload | ConfigPayload | ApiPayload

interface RequestsAction {
  type: ActionKind
  payload: PayloadType
}

interface RequestIndexTableState {
  url: string
  config: AxiosRequestConfig
  searchApi: RequestsSearchApi
}

export type {
  RequestIndexTableState,
  RequestsAction,
  UrlPayload,
  ConfigPayload,
  ApiPayload,
}
export { ActionKind }
