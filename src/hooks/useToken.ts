import { AxiosRequestConfig } from 'axios'
import { configure } from 'axios-hooks'
import { useMyAxios } from 'hooks/useMyAxios'
import { useTokenExpiration } from 'hooks/useTokenExpiration'
import jwtDecode, { JwtPayload } from 'jwt-decode'
import { useCallback, useEffect, useRef } from 'react'

export interface TokenResponse {
  access: string
  refresh: string
}

export const useToken = (
  onTokenInvalid: () => void,
  onTokenRefreshRequired: () => Promise<void>,
) => {
  const { axiosInstance } = useMyAxios()
  const accessToken = useRef<string>()
  const { clearAutomaticTokenRefresh, setTokenExpiration } = useTokenExpiration(
    onTokenRefreshRequired,
  )

  const setRefreshToken = useCallback((refreshToken) => {
    window.localStorage.setItem('refresh_token', refreshToken)
  }, [])

  const getRefreshToken = () => {
    return window.localStorage.getItem('refresh_token')
  }

  const setToken = useCallback(
    ({ access, refresh }: TokenResponse) => {
      accessToken.current = access
      const exp = jwtDecode<JwtPayload>(access).exp as number
      const expirationDate = new Date(exp * 1000)

      setTokenExpiration(expirationDate)
      setRefreshToken(refresh)
    },
    [setTokenExpiration, setRefreshToken],
  )

  const isAuthenticated = useCallback(() => {
    const authenticated = !!accessToken.current
    return authenticated
  }, [])

  const clearToken = useCallback(() => {
    accessToken.current = ''
    setRefreshToken(null)
    clearAutomaticTokenRefresh()
  }, [setRefreshToken, clearAutomaticTokenRefresh])

  const requestInterceptor = useCallback(
    (config: AxiosRequestConfig): AxiosRequestConfig => {
      if (!config.headers) config.headers = {}

      config.headers.Authorization = `Bearer ${accessToken.current}`

      return config
    },
    [accessToken],
  )

  const errorHandler = useCallback(
    (error) => {
      if (error.response?.status === 401 && accessToken.current) {
        if (accessToken) {
          clearToken()
          onTokenInvalid()
        }
      }
      return Promise.reject(error)
    },
    [clearToken, onTokenInvalid],
  )

  useEffect(() => {
    const req = axiosInstance.interceptors.request.use(requestInterceptor)
    const res = axiosInstance.interceptors.response.use((response) => {
      return response
    }, errorHandler)

    // Remove the old interceptors when the token changes
    if (req > 0) axiosInstance.interceptors.request.eject(0)
    if (res > 0) axiosInstance.interceptors.response.eject(0)

    configure({ axios: axiosInstance })
  }, [errorHandler, requestInterceptor, axiosInstance])

  return {
    clearToken,
    setToken,
    isAuthenticated,
    getRefreshToken,
  }
}
