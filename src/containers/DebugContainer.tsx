import { createContainer } from 'unstated-next'

const useDebugContainer = () => {
  const DEBUG_LOGIN = false
  const DEBUG_AUTH = false
  const DEBUG_LOCAL_STORAGE = false

  return {
    DEBUG_LOGIN,
    DEBUG_AUTH,
    DEBUG_LOCAL_STORAGE,
  }
}

export const DebugContainer = createContainer(useDebugContainer)
