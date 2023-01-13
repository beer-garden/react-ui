import { AxiosPromise, AxiosRequestConfig } from 'axios'
import useAxios from 'axios-hooks'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { useMyAxios } from 'hooks/useMyAxios'
import { useCallback } from 'react'
import { Garden, PatchData } from 'types/backend-types'
import { EmptyObject } from 'types/custom-types'

const useGardens = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const { axiosManualOptions } = useMyAxios()
  const [{ error, loading }, execute] = useAxios({}, axiosManualOptions)

  const getGardens = useCallback((): AxiosPromise<Garden[]> => {
    const config: AxiosRequestConfig = {
      url: '/api/v1/gardens',
      method: 'get',
      withCredentials: authEnabled,
    }

    return execute(config)
  }, [authEnabled, execute])

  const getGarden = useCallback(
    (name: string): AxiosPromise<Garden> => {
      const config: AxiosRequestConfig = {
        url: `/api/v1/gardens/${name}`,
        method: 'get',
        withCredentials: authEnabled,
      }

      return execute(config)
    },
    [authEnabled, execute],
  )

  const deleteGarden = useCallback(
    (name: string): AxiosPromise<EmptyObject> => {
      const config: AxiosRequestConfig = {
        url: `/api/v1/gardens/${name}`,
        method: 'delete',
        withCredentials: authEnabled,
      }

      return execute(config)
    },
    [authEnabled, execute],
  )

  const syncUsers = useCallback((): AxiosPromise<EmptyObject> => {
    const config: AxiosRequestConfig<PatchData> = {
      url: '/api/v1/gardens',
      method: 'patch',
      withCredentials: authEnabled,
      data: { path: '', value: '', operation: 'sync_users' },
    }

    return execute(config)
  }, [authEnabled, execute])

  const syncGarden = useCallback(
    (name: string): AxiosPromise<EmptyObject> => {
      const config: AxiosRequestConfig<PatchData> = {
        url: `/api/v1/gardens/${name}`,
        method: 'patch',
        withCredentials: authEnabled,
        data: { path: '', value: '', operation: 'sync' },
      }

      return execute(config)
    },
    [authEnabled, execute],
  )

  const createGarden = useCallback(
    (data: Garden): AxiosPromise<Garden> => {
      const config: AxiosRequestConfig<Garden> = {
        url: '/api/v1/gardens',
        method: 'POST',
        data: data,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        withCredentials: authEnabled,
      }

      return execute(config)
    },
    [authEnabled, execute],
  )

  const updateGarden = useCallback(
    (garden: Garden): AxiosPromise<Garden> => {
      const config: AxiosRequestConfig<PatchData> = {
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
        withCredentials: authEnabled,
      }

      return execute(config)
    },
    [authEnabled, execute],
  )

  return {
    error,
    loading,
    getGardens,
    getGarden,
    syncUsers,
    syncGarden,
    deleteGarden,
    createGarden,
    updateGarden,
  }
}

export default useGardens
