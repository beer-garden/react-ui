import { AxiosRequestConfig } from 'axios'
import useAxios from 'axios-hooks'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { useMyAxios } from 'hooks/useMyAxios'

const useSystems = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const { axiosManualOptions } = useMyAxios()
  const [, execute] = useAxios({}, axiosManualOptions)

  const getSystems = () => {
    const config: AxiosRequestConfig = {
      url: '/api/v1/systems',
      method: 'get',
      withCredentials: authEnabled,
    }

    return execute(config)
  }

  const reloadSystem = (systemId: string) => {
    const config: AxiosRequestConfig = {
      url: `/api/v1/systems/${systemId}`,
      method: 'patch',
      withCredentials: authEnabled,
      data: { operation: 'reload' },
    }

    return execute(config)
  }

  const deleteSystem = (systemId: string) => {
    const config: AxiosRequestConfig = {
      url: `/api/v1/systems/${systemId}`,
      method: 'delete',
      withCredentials: authEnabled,
    }

    return execute(config)
  }

  return {
    getSystems,
    reloadSystem,
    deleteSystem,
  }
}

export { useSystems }
