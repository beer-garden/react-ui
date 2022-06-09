import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { makeUseAxios } from 'axios-hooks'
import { useCallback } from 'react'

const BASE_URL = 'http://localhost:2337/' // TODO
const BASIC_REQUEST_CONFIG: AxiosRequestConfig = {
  baseURL: BASE_URL,
}

const useMyAxios = () => {
  // const axiosInstance: AxiosInstance = Axios.create(BASIC_REQUEST_CONFIG)
  const axiosInstance: AxiosInstance = Axios.create()

  const getUseAxios = useCallback(() => {
    return makeUseAxios({ axios: axiosInstance, cache: false })
  }, [axiosInstance])

  return { axiosInstance, getUseAxios }
}

export { useMyAxios }
