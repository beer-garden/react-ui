import { AxiosRequestConfig, Method as AxiosMethod } from 'axios'
import useAxios from 'axios-hooks'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { useMyAxios } from 'hooks/useMyAxios'
import { Instance, System } from 'types/backend-types'

const getConfig = (id: string, method: AxiosMethod, authEnabled: boolean) => {
  const config: AxiosRequestConfig<Instance> = {
    url: `/api/v1/instances/${id}`,
    method: method,
    withCredentials: authEnabled,
  }
  return config
}

const useFetchStatus = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const { axiosManualOptions } = useMyAxios()
  const [, execute] = useAxios({}, axiosManualOptions)

  /**
   * Fetches status of an instance from the backend after a timeout
   *
   * @param id instance id
   * @returns
   */
  const fetchStatus = (id: string) => {
    const config = getConfig(id, 'get', authEnabled)

    const promise = new Promise<string>((resolve, reject) => {
      setTimeout(async () => {
        const response = execute(config).then(async (resp) => {
          return resp.data.status
        })
        resolve(response)
      }, 2000)
    })

    return promise
  }

  return fetchStatus
}

const useToggleInstance = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const fetchStatus = useFetchStatus()
  const { axiosManualOptions } = useMyAxios()
  const [, execute] = useAxios({}, axiosManualOptions)

  const toggleInstance = async (id: string, operation: string) => {
    const config = getConfig(id, 'patch', authEnabled)

    const promiseResp = execute({
      ...config,
      data: { operation: operation },
    }).then(async (resolved) => {
      return await fetchStatus(resolved.data.id)
    })

    return promiseResp
  }

  return toggleInstance
}

const useInstances = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const { axiosManualOptions } = useMyAxios()
  const [, execute] = useAxios({}, axiosManualOptions)
  const toggleInstance = useToggleInstance()

  const startInstance = async (id: string) => {
    return await toggleInstance(id, 'start')
  }

  const stopInstance = async (id: string) => {
    return await toggleInstance(id, 'stop')
  }

  const stopAllInstances = (system: System) => {
    system.instances.forEach((instance) => toggleInstance(instance.id, 'stop'))
  }

  const startAllInstances = (system: System) => {
    system.instances.forEach((instance) => toggleInstance(instance.id, 'start'))
  }

  const getInstanceLogs = (
    id: string,
    timeout: number,
    startLine?: number,
    endLine?: number,
  ) => {
    const config: AxiosRequestConfig = {
      url: `/api/v1/instances/${id}/logs`,
      method: 'get',
      withCredentials: authEnabled,
      params: {
        start_line: startLine,
        end_line: endLine,
        timeout: timeout,
      },
    }

    return execute(config)
  }

  const downloadLogs = (id: string) => {
    const config: AxiosRequestConfig = {
      url: `/api/v1/instances/${id}/logs`,
      method: 'get',
      withCredentials: authEnabled,
      responseType: 'blob',
    }

    return execute(config)
  }

  return {
    startInstance,
    stopInstance,
    startAllInstances,
    stopAllInstances,
    getInstanceLogs,
    downloadLogs,
  }
}

export { useInstances }
