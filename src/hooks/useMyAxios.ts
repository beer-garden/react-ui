import Axios, { AxiosInstance } from 'axios'
import { Options as AxiosHooksOptions } from 'axios-hooks'
import { useMemo } from 'react'

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

  return { axiosInstance, axiosManualOptions }
}

export { useMyAxios }
