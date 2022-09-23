import { AxiosRequestConfig } from 'axios'
import useAxios from 'axios-hooks'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { useMyAxios } from 'hooks/useMyAxios'

const useGardens = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const { axiosManualOptions } = useMyAxios()
  const [, execute] = useAxios({}, axiosManualOptions)

  const getGardens = () => {
    const config: AxiosRequestConfig = {
      url: '/api/v1/gardens',
      method: 'get',
      withCredentials: authEnabled,
    }

    return execute(config)
  }

  const getGarden = (name: string) => {
    const config: AxiosRequestConfig = {
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

  const createGarden = (gardenName: string, patchData: unknown) => {
    const config: AxiosRequestConfig = {
      url: '/api/v1/gardens',
      method: 'POST',
      data: patchData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }

    return execute(config)
  }

  const updateGarden = (gardenName: string, patchData: unknown) => {
    const config: AxiosRequestConfig = {
      url: '/api/v1/gardens/' + encodeURIComponent(gardenName),
      method: 'PATCH',
      data: {
        operation: 'config',
        path: '',
        value: patchData,
      },
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }

    return execute(config)
  }

  return { getGardens, getGarden, syncUsers, deleteGarden, createGarden, updateGarden }
}

export default useGardens
