import { AxiosRequestConfig } from 'axios'
import { configure } from 'axios-hooks'
import { DebugContainer } from 'containers/DebugContainer'
import { useMountedState } from 'hooks/useMountedState'
import { useMyAxios } from 'hooks/useMyAxios'
import jwtDecode, { JwtPayload } from 'jwt-decode'
import { useCallback, useEffect, useRef } from 'react'
import Cookies from 'universal-cookie'

export interface TokenResponse {
  access: string
  refresh: string
}

export const useToken = (onTokenInvalid: () => void) => {
  const cookies = new Cookies()
  const tokenRefreshTimerId = useRef<number>()
  const [tokenExpiration, setTokenExpiration] = useMountedState<
    Date | undefined
  >()

  const { DEBUG_AUTH } = DebugContainer.useContainer()
  const { axiosInstance } = useMyAxios()

  const getRefreshToken = useCallback(() => {
    if (DEBUG_AUTH) {
      console.log('getRefreshToken invoked')
    }
    return window.localStorage.getItem('refresh_token')
  }, [DEBUG_AUTH])

  const setRefreshToken = useCallback(
    (refreshToken) => {
      if (DEBUG_AUTH) {
        console.log('setRefreshToken invoked')
      }
      window.localStorage.setItem('refresh_token', refreshToken)
    },
    [DEBUG_AUTH],
  )

  const setToken = useCallback(
    ({ access, refresh }: TokenResponse) => {
      if (DEBUG_AUTH) {
        console.log('setToken invoked')
      }
      const exp = jwtDecode<JwtPayload>(access).exp as number
      const expirationDate = new Date(exp * 1000)
      cookies.set('token', access, { path: '/', expires: expirationDate })
      setTokenExpiration(expirationDate)
      setRefreshToken(refresh)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [DEBUG_AUTH, setRefreshToken],
  )

  const onTokenRefreshRequired = useCallback(async () => {
    if (DEBUG_AUTH) {
      console.log('onTokenRefreshRequired invoked')
    }
    const {
      data: { access, refresh },
    } = await axiosInstance.post<TokenResponse>('/api/v1/token/refresh', {
      refresh: getRefreshToken(),
    })

    setToken({ access, refresh })
  }, [DEBUG_AUTH, axiosInstance, getRefreshToken, setToken])

  useEffect(() => {
    if (tokenExpiration instanceof Date && !isNaN(tokenExpiration.valueOf())) {
      const now = new Date()
      const triggerMilliseconds = tokenExpiration.getTime() - now.getTime()

      if (DEBUG_AUTH) {
        console.log(`setting token refresh to ${triggerMilliseconds} ms`)
      }

      tokenRefreshTimerId.current = window.setTimeout(async () => {
        onTokenRefreshRequired()
      }, triggerMilliseconds)
    }

    return () => {
      window.clearTimeout(tokenRefreshTimerId.current)
    }
  }, [DEBUG_AUTH, onTokenRefreshRequired, tokenExpiration])

  const clearAutomaticTokenRefresh = useCallback(() => {
    if (DEBUG_AUTH) {
      console.log('clearAutomaticTokenRefresh invoked')
    }
    window.clearTimeout(tokenRefreshTimerId.current)
    setTokenExpiration(undefined)
  }, [DEBUG_AUTH, setTokenExpiration])

  const isAuthenticated = useCallback(() => {
    return !!cookies.get('token')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const clearToken = useCallback(() => {
    if (DEBUG_AUTH) {
      console.log('clearing token')
    }
    cookies.remove('token', { path: '/' })
    cookies.remove('user', { path: '/' })
    cookies.remove('globalPerms', { path: '/' })
    cookies.remove('domainPerms', { path: '/' })
    setRefreshToken(null)
    clearAutomaticTokenRefresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DEBUG_AUTH, setRefreshToken, clearAutomaticTokenRefresh])

  const requestInterceptor = useCallback(
    (config: AxiosRequestConfig): AxiosRequestConfig => {
      if (!config.headers) config.headers = {}
      config.headers.Authorization = `Bearer ${cookies.get('token')}`

      if (DEBUG_AUTH) {
        console.log('config in requestInterceptor', config)
      }

      return config
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [DEBUG_AUTH],
  )

  const errorHandler = useCallback(
    (error) => {
      if (DEBUG_AUTH) {
        if (error.response) {
          console.log(
            'error.response.status in errorHandler',
            error.response.status,
          )
        }
      }
      if (error.response?.status === 401 && cookies.get('token')) {
        clearToken()
        onTokenInvalid()
      }
      return Promise.reject(error)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [DEBUG_AUTH, clearToken, onTokenInvalid],
  )

  useEffect(() => {
    const req = axiosInstance.interceptors.request.use(requestInterceptor)
    const res = axiosInstance.interceptors.response.use((response) => {
      if (DEBUG_AUTH) {
        console.log('response in interceptor', response)
      }
      return response
    }, errorHandler)

    // Remove the old interceptors when the token changes
    if (req > 0) {
      if (DEBUG_AUTH) {
        console.log(`req = ${req}, removing old interceptor`)
      }
      axiosInstance.interceptors.request.eject(0)
    }
    if (res > 0) {
      if (DEBUG_AUTH) {
        console.log(`res = ${res}, removing old interceptor`)
      }
      axiosInstance.interceptors.response.eject(0)
    }

    configure({ axios: axiosInstance })
  }, [errorHandler, requestInterceptor, axiosInstance, DEBUG_AUTH])

  return {
    clearToken,
    setToken,
    isAuthenticated,
    onTokenRefreshRequired,
    tokenExpiration,
  }
}
