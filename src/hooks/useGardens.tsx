import { AxiosRequestConfig } from 'axios'
import useAxios from 'axios-hooks'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { useMyAxios } from 'hooks/useMyAxios'
import { Garden } from 'types/backend-types'

const useGardens = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const { axiosManualOptions } = useMyAxios()
  const [, execute] = useAxios({}, axiosManualOptions)

  const getGardens = () => {
    const config: AxiosRequestConfig<Garden[]> = {
      url: '/api/v1/gardens',
      method: 'get',
      withCredentials: authEnabled,
    }

    return execute(config)
  }

  const getGarden = (name: string) => {
    const config: AxiosRequestConfig<Garden> = {
      url: `/api/v1/gardens/${name}`,
      method: 'get',
      withCredentials: authEnabled,
    }

    return execute(config)
  }

  const deleteGarden = (name: string) => {
    const config: AxiosRequestConfig = {
      url: `/api/v1/gardens/${name}`,
      method: 'delete',
      withCredentials: authEnabled,
    }

    return execute(config)
  }

  const syncUsers = () => {
    const config: AxiosRequestConfig = {
      url: '/api/v1/gardens',
      method: 'patch',
      withCredentials: authEnabled,
      data: { path: '', value: '', operation: 'sync_users' },
    }

    return execute(config)
  }

  const createGarden = (data: Garden) => {
    const config: AxiosRequestConfig = {
      url: '/api/v1/gardens',
      method: 'POST',
      data: data,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }

    return execute(config)
  }

  const updateGarden = (garden: Garden) => {
    const config: AxiosRequestConfig = {
      url: `/api/v1/gardens/${garden.name}`,
      method: 'PATCH',
      data: {
        operation: 'config',
        path: '',
        value: garden,
      },
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }

    return execute(config)
  }

  return {
    getGardens,
    getGarden,
    syncUsers,
    deleteGarden,
    createGarden,
    updateGarden,
  }
}

export default useGardens
