import { AxiosRequestConfig } from 'axios'
import {
  ActionKind,
  ApiPayload,
  baseSearchApi,
  ConfigPayload,
  RequestIndexTableState,
  RequestsAction,
  RequestsSearchApi,
  UrlPayload,
} from 'pages/RequestsIndex/RequestsIndexTable/data'
import { useCallback, useMemo, useReducer } from 'react'

const initialRequestState: RequestIndexTableState = {
  url: '',
  config: {},
  searchApi: baseSearchApi,
}

const requestReducer = (
  state: RequestIndexTableState,
  action: RequestsAction,
): RequestIndexTableState => {
  const { type, payload } = action

  switch (type) {
    case ActionKind.UPDATE_URL:
      return {
        ...state,
        url: payload as UrlPayload,
      }
    case ActionKind.UPDATE_CONFIG:
      return {
        ...state,
        config: payload as ConfigPayload,
      }
    case ActionKind.UPDATE_SEARCH_API: {
      return {
        ...state,
        searchApi: payload as ApiPayload,
      }
    }
    default:
      return state
  }
}

const useRequestsReducer = () => {
  const [state, dispatch] = useReducer(requestReducer, initialRequestState)

  const updateUrl = useCallback((url: string) => {
    dispatch({ type: ActionKind.UPDATE_URL, payload: url })
  }, [])
  const updateConfig = useCallback((config: AxiosRequestConfig) => {
    dispatch({ type: ActionKind.UPDATE_CONFIG, payload: config })
  }, [])
  const updateApi = useCallback((api: RequestsSearchApi) => {
    dispatch({ type: ActionKind.UPDATE_SEARCH_API, payload: api })
  }, [])

  const searchApi = useMemo(() => state.searchApi, [state.searchApi])
  const config = useMemo(() => state.config, [state.config])

  return {
    searchApi,
    config,
    updateUrl,
    updateConfig,
    updateApi,
  }
}

export { useRequestsReducer }
