import { AxiosPromise, AxiosRequestConfig } from 'axios'
import useAxios from 'axios-hooks'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { useMyAxios } from 'hooks/useMyAxios'
import { useCallback } from 'react'
import { Runner } from 'types/backend-types'

const useRunners = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const { axiosManualOptions } = useMyAxios()
  const [, execute] = useAxios({}, axiosManualOptions)

  const getRunners = useCallback((): AxiosPromise<Runner[]> => {
    const config: AxiosRequestConfig = {
      url: '/api/vbeta/runners',
      method: 'get',
      withCredentials: authEnabled,
    }

    return execute(config)
  }, [authEnabled, execute])

  const reloadRunner = useCallback(
    (path: string): AxiosPromise<Runner[]> => {
      const config: AxiosRequestConfig = {
        url: '/api/vbeta/runners',
        method: 'patch',
        withCredentials: authEnabled,
        data: { operation: 'reload', path: path },
      }

      return execute(config)
    },
    [authEnabled, execute],
  )

  const stopRunner = useCallback(
    (runnerId: string): AxiosPromise<Runner> => {
      const config: AxiosRequestConfig = {
        url: `/api/vbeta/runners/${runnerId}`,
        method: 'patch',
        withCredentials: authEnabled,
        data: { operation: 'stop' },
      }

      return execute(config)
    },
    [authEnabled, execute],
  )

  const startRunner = useCallback(
    (runnerId: string): AxiosPromise<Runner> => {
      const config: AxiosRequestConfig = {
        url: `/api/vbeta/runners/${runnerId}`,
        method: 'patch',
        withCredentials: authEnabled,
        data: { operation: 'start' },
      }

      return execute(config)
    },
    [authEnabled, execute],
  )

  const deleteRunner = useCallback(
    (runnerId: string): AxiosPromise<Runner> => {
      const config: AxiosRequestConfig = {
        url: `/api/vbeta/runners/${runnerId}`,
        method: 'delete',
        withCredentials: authEnabled,
      }

      return execute(config)
    },
    [authEnabled, execute],
  )

  return {
    getRunners,
    reloadRunner,
    stopRunner,
    startRunner,
    deleteRunner,
  }
}

export { useRunners }
