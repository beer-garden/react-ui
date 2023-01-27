import { DebugContainer } from 'containers/DebugContainer'
import { SocketContainer } from 'containers/SocketContainer'
import { useMountedState } from 'hooks/useMountedState'
import { useMyAxios } from 'hooks/useMyAxios'
import { TokenResponse, useToken } from 'hooks/useToken'
import { useCallback, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Cookies from 'universal-cookie'
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
  const cookies = new Cookies()
  const [user, _setUser] = useMountedState<string | null>(cookies.get('user'))

  const setUser = useCallback(
    (userName: string | null) => {
      if (DEBUG_LOGIN) {
        console.log('Setting username:', userName)
      }
      _setUser(userName)
      if (userName) {
        cookies.set('user', userName, { path: '/' })
      } else {
        cookies.remove('user', { path: '/' })
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [DEBUG_LOGIN],
  )

  const onTokenInvalid = useCallback(() => {
    setUser(null)
  }, [setUser])

  const {
    clearToken,
    setToken,
    isAuthenticated,
    onTokenRefreshRequired,
    tokenExpiration,
  } = useToken(onTokenInvalid)

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

  const { pathname } = useLocation()
  const logout = useCallback(() => {
    clearToken()
    setUser(null)
    navigate(pathname)
  }, [clearToken, setUser, navigate, pathname])

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
    login,
    logout,
    refreshToken: onTokenRefreshRequired,
    isAuthenticated,
    tokenExpiration,
  }
}

export const AuthContainer = createContainer(useAuth)
