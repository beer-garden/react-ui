import { DebugSettings } from 'types/config-types'
import { createContainer } from 'unstated-next'

const useDebugContainer = (
  initialState: DebugSettings = {
    LOGIN: false,
    AUTH: false,
    LOCAL_STORAGE: false,
    PERMISSION: false,
    SOCKET: false,
  },
) => {
  const DEBUG_LOGIN = initialState.LOGIN
  const DEBUG_AUTH = initialState.AUTH
  const DEBUG_LOCAL_STORAGE = initialState.LOCAL_STORAGE
  const DEBUG_PERMISSION = initialState.PERMISSION
  const DEBUG_SOCKET = initialState.SOCKET
  const DEBUG_DYNAMIC_COMMANDS = true

  return {
    DEBUG_LOGIN,
    DEBUG_AUTH,
    DEBUG_LOCAL_STORAGE,
    DEBUG_PERMISSION,
    DEBUG_SOCKET,
    DEBUG_DYNAMIC_COMMANDS,
  }
}

export const DebugContainer = createContainer(useDebugContainer)
