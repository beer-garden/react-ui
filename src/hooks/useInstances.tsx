import { AxiosRequestConfig, Method as AxiosMethod } from 'axios'
import useAxios, { Options as AxiosHooksOptions } from 'axios-hooks'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { useMyAxios } from 'hooks/useMyAxios'
import { Instance, System } from 'types/backend-types'

const axiosOptions: AxiosHooksOptions = {
  manual: true,
  useCache: false,
  ssr: false,
  autoCancel: false,
}

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

  const [, execute] = useAxios({}, axiosOptions)

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

  const [, execute] = useAxios({}, axiosOptions)

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

const useStartInstance = () => {
  const toggleInstance = useToggleInstance()

  const startInstance = async (id: string) => {
    return await toggleInstance(id, 'start')
  }

  return { startInstance }
}

const useStopInstance = () => {
  const toggleInstance = useToggleInstance()

  const stopInstance = async (id: string) => {
    return await toggleInstance(id, 'start')
  }

  return { stopInstance }
}

const useStartAllInstances = () => {
  const toggleInstance = useToggleInstance()

  const startAllInstances = (system: System) => {
    system.instances.forEach((instance) => toggleInstance(instance.id, 'start'))
  }

  return { startAllInstances }
}

const useStopAllInstances = () => {
  const toggleInstance = useToggleInstance()

  const stopAllInstances = (system: System) => {
    system.instances.forEach((instance) => toggleInstance(instance.id, 'stop'))
  }

  return { stopAllInstances }
}

const useInstances = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const { axiosManualOptions } = useMyAxios()
  const [, execute] = useAxios({}, axiosManualOptions)

  const getInstanceLogs = (
    id: string,
    timeout: number,
    startLine?: number,
    endLine?: number,
  ) => {
    return execute({
      url: `/api/v1/instances/${id}/logs`,
      method: 'get',
      withCredentials: authEnabled,
      params: {
        start_line: startLine,
        end_line: endLine,
        timeout: timeout,
      },
    })
  }

  const downloadLogs = (id: string) => {
    return execute({
      url: `/api/v1/instances/${id}/logs`,
      method: 'get',
      withCredentials: authEnabled,
      responseType: 'blob',
    })
  }

  return {
    getInstanceLogs,
    downloadLogs,
    useStartInstance,
  }
}

export {
  useInstances,
  useStartAllInstances,
  useStartInstance,
  useStopAllInstances,
  useStopInstance,
}
