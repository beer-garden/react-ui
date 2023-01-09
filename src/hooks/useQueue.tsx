import { AxiosPromise } from 'axios'
import useAxios from 'axios-hooks'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { useMyAxios } from 'hooks/useMyAxios'
import { useCallback } from 'react'
import { Queue } from 'types/backend-types'

const useQueue = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const { axiosManualOptions } = useMyAxios()
  const [, execute] = useAxios({}, axiosManualOptions)

  const getInstanceQueues = useCallback(
    (instanceId: string): AxiosPromise<Queue[]> => {
      return execute({
        url: `/api/v1/instances/${instanceId}/queues`,
        method: 'get',
        withCredentials: authEnabled,
      })
    },
    [authEnabled, execute],
  )

  const clearQueue = useCallback(
    (name: string): AxiosPromise<Queue[]> => {
      return execute({
        url: `/api/v1/queues/${name}`,
        method: 'delete',
        withCredentials: authEnabled,
      })
    },
    [authEnabled, execute],
  )

  const clearQueues = useCallback((): AxiosPromise<Queue[]> => {
    return execute({
      url: '/api/v1/queues',
      method: 'delete',
      withCredentials: authEnabled,
    })
  }, [authEnabled, execute])

  const getQueues = useCallback((): AxiosPromise<Queue[]> => {
    return execute({
      url: '/api/v1/queues',
      method: 'get',
      withCredentials: authEnabled,
    })
  }, [authEnabled, execute])

  return {
    getInstanceQueues,
    clearQueues,
    clearQueue,
    getQueues,
  }
}

export default useQueue
