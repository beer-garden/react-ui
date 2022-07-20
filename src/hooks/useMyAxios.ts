import Axios, { AxiosInstance } from 'axios'
import { makeUseAxios } from 'axios-hooks'
import { useCallback, useMemo } from 'react'

const useMyAxios = () => {
  // const axiosInstance: AxiosInstance = Axios.create(BASIC_REQUEST_CONFIG)
  const axiosInstance: AxiosInstance = useMemo(() => { return Axios.create() }, [])

  const getUseAxios = useCallback(() => {
    console.log("Making new axios!")
    return makeUseAxios({ axios: axiosInstance, cache: false })
  }, [axiosInstance])

  return { axiosInstance, getUseAxios }
}

export { useMyAxios }
