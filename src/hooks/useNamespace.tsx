import { AxiosRequestConfig } from 'axios'
import useAxios from 'axios-hooks'
import { ServerConfigContainer } from 'containers/ConfigContainer'

import { useMyAxios } from './useMyAxios'

const useNamespace = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const { axiosManualOptions } = useMyAxios()
  const [, execute] = useAxios({}, axiosManualOptions)
  const getNamespaces = () => {
    const config: AxiosRequestConfig = {
      url: '/api/v1/namespaces',
      method: 'get',
      withCredentials: authEnabled,
    }

    return execute(config)
  }
  return { getNamespaces }
}

export { useNamespace }
