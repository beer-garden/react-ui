import { useRef, useCallback, useEffect } from 'react'
import { useTokenExpiration } from './useTokenExpiration'
import { AxiosRequestConfig } from 'axios'
import jwtDecode, { JwtPayload } from 'jwt-decode'
import useMyAxios from './useMyAxios'
import { configure } from 'axios-hooks'

export interface TokenResponse {
  access: string
  refresh: string
}

export const useToken = (
  onTokenInvalid: () => void,
  onTokenRefreshRequired: () => Promise<void>
) => {
  const { axiosInstance } = useMyAxios()
  const accessToken = useRef<string>()
  const { clearAutomaticTokenRefresh, setTokenExpiration } = useTokenExpiration(
    onTokenRefreshRequired
  )

  const setRefreshToken = useCallback((refreshToken) => {
    window.localStorage.setItem('refresh_token', refreshToken)
    console.log(
      'useToken.setRefreshToken REFRESH TOKEN SET TO: ',
      String(window.localStorage.getItem('refresh_token'))
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
        accessToken.current
      )

      const exp = jwtDecode<JwtPayload>(access).exp as number
      console.log('useToken.setToken TOKEN EXP NUM', exp)

      const expirationDate = new Date(exp * 1000)
      console.log('useToken.setToken TOKEN EXP DATE: ', expirationDate)

      setTokenExpiration(expirationDate)
      setRefreshToken(refresh)
    },
    [setTokenExpiration, setRefreshToken]
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

  useEffect(() => {
    axiosInstance.interceptors.request.use(
      (config: AxiosRequestConfig): AxiosRequestConfig => {
        console.log('useToken altering request interceptor')
        if (!config.headers) config.headers = {}
        if (config.headers.Authorization)
          console.log('OLD HEADER', config.headers.Authorization)
        config.headers.Authorization = `Bearer ${accessToken.current}`
        return config
      }
    )
    axiosInstance.interceptors.response.use(
      (response) => {
        return response
      },
      (error) => {
        console.log('useToken response interceptor received error: ', error)
        if (
          error.response &&
          error.response.status === 401 &&
          accessToken.current
        ) {
          console.log('RESPONSE INDICATES BAD TOKEN')
          clearToken()
          onTokenInvalid()
        }
        return Promise.reject(error)
      }
    )

    configure({ axios: axiosInstance })
  }, [clearToken, onTokenInvalid, axiosInstance])

  return {
    clearToken,
    setToken,
    isAuthenticated,
    getRefreshToken,
  }
}
