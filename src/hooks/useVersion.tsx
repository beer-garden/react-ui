import { AxiosPromise, AxiosRequestConfig } from 'axios'
import useAxios from 'axios-hooks'
import { useMyAxios } from 'hooks/useMyAxios'
import { VersionConfig } from 'types/config-types'

const useVersion = () => {
  const { axiosManualOptions } = useMyAxios()
  const [, execute] = useAxios({}, axiosManualOptions)

  const getVersion = (): AxiosPromise<VersionConfig> => {
    const config: AxiosRequestConfig = {
      url: '/version',
      method: 'get',
      withCredentials: false,
    }
    return execute(config)
  }

  return { getVersion }
}

export default useVersion
