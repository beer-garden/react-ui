import { createContainer } from 'unstated-next'

const useDebugContainer = (
  initialState = {
    LOGIN: false,
    AUTH: false,
    LOCAL_STORAGE: false,
    SOCKET: false,
  },
) => {
  const DEBUG_LOGIN = initialState.LOGIN
  const DEBUG_AUTH = initialState.AUTH
  const DEBUG_LOCAL_STORAGE = initialState.LOCAL_STORAGE
  const DEBUG_SOCKET = initialState.SOCKET

  return {
    DEBUG_LOGIN,
    DEBUG_AUTH,
    DEBUG_LOCAL_STORAGE,
    DEBUG_SOCKET,
  }
}

export const DebugContainer = createContainer(useDebugContainer)
