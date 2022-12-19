import { AxiosPromise } from 'axios'
import useAxios from 'axios-hooks'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { useMyAxios } from 'hooks/useMyAxios'
import { Queue } from 'types/backend-types'

const useQueue = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const { axiosManualOptions } = useMyAxios()
  const [, execute] = useAxios({}, axiosManualOptions)

  const getInstanceQueues = (instanceId: string): AxiosPromise<Queue[]> => {
    return execute({
      url: `/api/v1/instances/${instanceId}/queues`,
      method: 'get',
      withCredentials: authEnabled,
    })
  }

  const clearQueue = (name: string): AxiosPromise<Queue[]> => {
    return execute({
      url: `/api/v1/queues/${name}`,
      method: 'delete',
      withCredentials: authEnabled,
    })
  }

  const clearQueues = (): AxiosPromise<Queue[]> => {
    return execute({
      url: '/api/v1/queues/',
      method: 'delete',
      withCredentials: authEnabled,
    })
  }

  const getQueues = (): AxiosPromise<Queue[]> => {
    return execute({
      url: '/api/v1/queues/',
      method: 'get',
      withCredentials: authEnabled,
    })
  }

  return {
    getInstanceQueues,
    clearQueues,
    clearQueue,
    getQueues,
  }
}

export default useQueue
