import { createContainer } from 'unstated-next'

const useDebugContainer = () => {
  const DEBUG_LOGIN = false
  const DEBUG_AUTH = false

  return {
    DEBUG_LOGIN,
    DEBUG_AUTH,
  }
}

export const DebugContainer = createContainer(useDebugContainer)
