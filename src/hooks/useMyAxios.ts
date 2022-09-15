import Axios, { AxiosInstance } from 'axios'
import { makeUseAxios, Options as AxiosHooksOptions } from 'axios-hooks'
import { useCallback, useMemo } from 'react'

const useMyAxios = () => {
  const axiosManualOptions: AxiosHooksOptions = {
    manual: true,
    useCache: false,
    ssr: false,
    autoCancel: false,
  }

  const axiosInstance: AxiosInstance = useMemo(() => {
    return Axios.create()
  }, [])

  const getUseAxios = useCallback(() => {
    return makeUseAxios({ axios: axiosInstance, cache: false })
  }, [axiosInstance])

  return { axiosInstance, getUseAxios, axiosManualOptions }
}

export { useMyAxios }
