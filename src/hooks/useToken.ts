import { AxiosRequestConfig } from 'axios'
import { configure } from 'axios-hooks'
import jwtDecode, { JwtPayload } from 'jwt-decode'
import { useCallback, useEffect, useRef } from 'react'
import { useMyAxios } from 'hooks/useMyAxios'
import { useTokenExpiration } from 'hooks/useTokenExpiration'

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
    console.log(
      'useToken.setRefreshToken REFRESH TOKEN SET TO: ',
      String(window.localStorage.getItem('refresh_token')),
    )
  }, [])

  const getRefreshToken = () => {
    return window.localStorage.getItem('refresh_token')
  }

  const setToken = useCallback(
    ({ access, refresh }: TokenResponse) => {
      accessToken.current = access
      console.log(
        'useToken.setToken ACCESS TOKEN REF SET TO: ',
        accessToken.current,
      )

      const exp = jwtDecode<JwtPayload>(access).exp as number
      console.log('useToken.setToken TOKEN EXP NUM', exp)

      const expirationDate = new Date(exp * 1000)
      console.log('useToken.setToken TOKEN EXP DATE: ', expirationDate)

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

  const requestInterceptor = useCallback((config: AxiosRequestConfig): AxiosRequestConfig => {
    console.log('useToken altering request interceptor')
    if (!config.headers) config.headers = {}
    if (config.headers.Authorization)
      console.log(`OLD HEADER: ${config.headers.Authorization}\n vs: \n ${accessToken.current}`)
    config.headers.Authorization = `Bearer ${accessToken.current}`
    return config
  }, [accessToken])

  const errorHandler = useCallback((error) => {
    console.log('useToken response interceptor received error: ', error)
    if (
      error.response?.status === 401 &&
      accessToken.current
    ) {
      if (accessToken) {
        console.log('RESPONSE INDICATES BAD TOKEN')
        clearToken()
        onTokenInvalid()
      }
    }
    return Promise.reject(error)
  }, [clearToken, onTokenInvalid])

  useEffect(() => {
    const req = axiosInstance.interceptors.request.use(requestInterceptor)
    const res = axiosInstance.interceptors.response.use(
      (response) => {
        return response
      },
      errorHandler
    )

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
