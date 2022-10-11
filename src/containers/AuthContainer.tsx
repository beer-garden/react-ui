import { DebugContainer } from 'containers/DebugContainer'
import { SocketContainer } from 'containers/SocketContainer'
import { useMyAxios } from 'hooks/useMyAxios'
import { TokenResponse, useToken } from 'hooks/useToken'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createContainer } from 'unstated-next'

enum AuthEvents {
  LOGOUT = 'LOGOUT',
  LOGIN = 'LOGIN',
}

const useAuth = () => {
  const { DEBUG_LOGIN } = DebugContainer.useContainer()
  const { updateSocketToken } = SocketContainer.useContainer()
  const { axiosInstance } = useMyAxios()
  const navigate = useNavigate()
  const [user, _setUser] = useState<string | null>(null)

  const setUser = useCallback(
    (userName: string | null) => {
      if (DEBUG_LOGIN) {
        console.log('Setting username:', userName)
      }
      _setUser(userName)
    },
    [DEBUG_LOGIN],
  )

  const onTokenInvalid = useCallback(() => {
    setUser(null)
  }, [setUser])

  const { clearToken, setToken, isAuthenticated, onTokenRefreshRequired } =
    useToken(onTokenInvalid)

  useEffect(() => {
    window.addEventListener(
      'storage',
      async (event: WindowEventMap['storage']) => {
        if (event.key === AuthEvents.LOGOUT && isAuthenticated()) {
          clearToken()
          setUser(null)
        } else if (event.key === AuthEvents.LOGIN) {
          onTokenRefreshRequired()
        }
      },
    )
  }, [clearToken, isAuthenticated, onTokenRefreshRequired, setUser])

  const logout = useCallback(() => {
    clearToken()
    setUser(null)
    navigate('/')
  }, [clearToken, setUser, navigate])

  const login = useCallback(
    async (username: string, password: string) => {
      const {
        data: { access, refresh },
      } = await axiosInstance.post<TokenResponse>('/api/v1/token', {
        username,
        password,
      })

      if (DEBUG_LOGIN) {
        console.log('AuthContainer.login().access', access)
        console.log('AuthContainer.login().refresh', refresh)
      }

      setUser(username)
      setToken({ access, refresh })
      updateSocketToken(access)

      window.localStorage.setItem(AuthEvents.LOGIN, new Date().toISOString())
    },
    [axiosInstance, DEBUG_LOGIN, setUser, setToken, updateSocketToken],
  )

  return {
    user,
    setUser,
    login,
    logout,
    refreshToken: onTokenRefreshRequired,
    isAuthenticated,
  }
}

export const AuthContainer = createContainer(useAuth)
