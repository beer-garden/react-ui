import { AxiosPromise, AxiosRequestConfig } from 'axios'
import useAxios from 'axios-hooks'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { useMyAxios } from 'hooks/useMyAxios'
import { Runner } from 'types/backend-types'

const useRunners = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const { axiosManualOptions } = useMyAxios()
  const [, execute] = useAxios({}, axiosManualOptions)

  const getRunners = (): AxiosPromise<Runner[]> => {
    const config: AxiosRequestConfig = {
      url: '/api/vbeta/runners',
      method: 'get',
      withCredentials: authEnabled,
    }

    return execute(config)
  }

  const reloadRunner = (path: string) => {
    const config: AxiosRequestConfig = {
      url: '/api/vbeta/runners',
      method: 'patch',
      withCredentials: authEnabled,
      data: { operation: 'reload', path: path },
    }

    return execute(config)
  }

  const stopRunner = (runnerId: string) => {
    const config: AxiosRequestConfig = {
      url: `/api/vbeta/runners/${runnerId}`,
      method: 'patch',
      withCredentials: authEnabled,
      data: { operation: 'stop' },
    }

    return execute(config)
  }

  const startRunner = (runnerId: string) => {
    const config: AxiosRequestConfig = {
      url: `/api/vbeta/runners/${runnerId}`,
      method: 'patch',
      withCredentials: authEnabled,
      data: { operation: 'start' },
    }

    return execute(config)
  }

  const deleteRunner = (runnerId: string) => {
    const config: AxiosRequestConfig = {
      url: `/api/vbeta/runners/${runnerId}`,
      method: 'delete',
      withCredentials: authEnabled,
    }

    return execute(config)
  }

  return {
    getRunners,
    reloadRunner,
    stopRunner,
    startRunner,
    deleteRunner,
  }
}

export { useRunners }
