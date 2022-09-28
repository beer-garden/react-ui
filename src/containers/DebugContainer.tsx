import { useState } from 'react'
import { DebugSettings } from 'types/config-types'
import { createContainer } from 'unstated-next'


const useDebugContainer = () => {
  const [DEBUG_LOGIN, setLogin] = useState<boolean>(false)
  const [DEBUG_AUTH, setAuth] = useState<boolean>(false)
  const [DEBUG_LOCAL_STORAGE, setStorage] = useState<boolean>(false)
  const [DEBUG_SOCKET, setSocket] = useState<boolean>(false)

  const setDebug = (newSettings: DebugSettings) => {
    setLogin(newSettings.DEBUG_LOGIN || DEBUG_LOGIN)
    setAuth(newSettings.DEBUG_AUTH || DEBUG_AUTH)
    setStorage(newSettings.DEBUG_LOCAL_STORAGE || DEBUG_LOCAL_STORAGE)
    setSocket(newSettings.DEBUG_SOCKET || DEBUG_SOCKET)
  }

  return {
    DEBUG_LOGIN,
    DEBUG_AUTH,
    DEBUG_LOCAL_STORAGE,
    DEBUG_SOCKET,
    setDebug,
  }
}

export const DebugContainer = createContainer(useDebugContainer)
