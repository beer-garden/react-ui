import { AxiosRequestConfig } from 'axios'
import { RequestsSearchApi } from 'pages/RequestsIndex/RequestsIndexTable/data'

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
  ApiPayload,
  ConfigPayload,
  RequestIndexTableState,
  RequestsAction,
  UrlPayload,
}
export { ActionKind }
