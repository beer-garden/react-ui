import { ServerConfigContainer } from 'containers/ConfigContainer'
import { useMyAxios } from 'hooks/useMyAxios'
import { Queue, System } from 'types/backend-types'

const useQueue = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const { axiosInstance } = useMyAxios()

  const getInstanceQueues = (instanceId: string) => {
    return axiosInstance.get<Queue[]>(
      `/api/v1/instances/${instanceId}/queues`,
      {
        withCredentials: authEnabled,
      },
    )
  }

  const clearQueue = (name: string) => {
    return axiosInstance.delete<System[]>(`/api/v1/queues/${name}`, {
      withCredentials: authEnabled,
    })
  }

  const clearQueues = () => {
    return axiosInstance.delete<System[]>('/api/v1/queues/', {
      withCredentials: authEnabled,
    })
  }

  const getQueues = () => {
    return axiosInstance.get<System[]>('/api/v1/queues/', {
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
