import axios, { AxiosInstance } from 'axios'
import { makeUseAxios } from 'axios-hooks'
import { useCallback, useMemo } from 'react'

const useMyAxios = () => {
  const axiosInstance: AxiosInstance = useMemo(() => {
    return axios.create({
      // baseURL: `http://${process.env.REACT_APP_HOSTNAME}:2337`,
    })
  }, [])

  const getUseAxios = useCallback(() => {
    return makeUseAxios({ axios: axiosInstance, cache: false })
  }, [axiosInstance])

  return { axiosInstance, getUseAxios }
}

export { useMyAxios }
