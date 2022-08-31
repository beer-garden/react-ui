import { ServerConfigContainer } from 'containers/ConfigContainer'
import { useMyAxios } from 'hooks/useMyAxios'
import { Instance } from 'types/backend-types'

export const useInstances = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const { axiosInstance } = useMyAxios()

  const stopInstance = (id: string) => {
    axiosInstance.patch<Instance>(
      `/api/v1/instances/${id}`,
      {
        operation: 'stop',
      },
      {
        withCredentials: authEnabled,
      },
    )
  }

  const startInstance = (id: string) => {
    axiosInstance.patch<Instance>(
      `/api/v1/instances/${id}`,
      {
        operation: 'start',
      },
      {
        withCredentials: authEnabled,
      },
    )
  }

  const getInstance = (id: string) => {
    axiosInstance.get<Instance>(`/api/v1/instances/${id}`, {
      withCredentials: authEnabled,
    })
  }

  const getInstanceLogs = (
    id: string,
    timeout: number,
    startLine?: number,
    endLine?: number,
  ) => {
    return axiosInstance.get(`/api/v1/instances/${id}/logs`, {
      params: {
        start_line: startLine,
        end_line: endLine,
        timeout: timeout,
      },
      withCredentials: authEnabled,
    })
  }

  const downloadLogs = (id: string) => {
    return axiosInstance.get(`/api/v1/requests/output/${id}`, {
      responseType: 'blob',
      withCredentials: authEnabled,
    })
  }

  return {
    startInstance,
    stopInstance,
    getInstance,
    getInstanceLogs,
    downloadLogs,
  }
}
