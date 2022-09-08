import { ServerConfigContainer } from 'containers/ConfigContainer'
import { useMyAxios } from 'hooks/useMyAxios'
import { useCallback, useState } from 'react'
import { Instance, System } from 'types/backend-types'

const useSystems = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const [systems, setSystems] = useState<System[]>([])
  const { axiosInstance } = useMyAxios()

  const fetchSystems = useCallback(async () => {
    const { data } = await axiosInstance.get<System[]>('/api/v1/systems', {
      withCredentials: authEnabled,
    })
    setSystems(data)
    return data
  }, [setSystems, axiosInstance, authEnabled])

  const getSystems = () => {
    if (systems && systems.length > 0) {
      return systems
    } else {
      fetchSystems()
      return []
    }
  }

  /**
   * Fetches status of an instance from the backend after a timeout
   * @param id instance id
   * @returns
   */
  const fetchStatus = async (id: string) => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const myResp = await axiosInstance
          .get<Instance>(`/api/v1/instances/${id}`, {
            withCredentials: authEnabled,
          })
          .then(async (resp) => {
            return resp.data.status
          })
        resolve(myResp)
      }, 2000)
    })
  }

  const toggleInstance = async (id: string, operation: string) => {
    const promiseResp = await axiosInstance
      .patch<Instance>(`/api/v1/instances/${id}`, {
        withCredentials: authEnabled,
        operation,
      })
      .then(async (resolved) => {
        // returned status not correct, need to fetch fresh
        return await fetchStatus(resolved.data.id)
      })
    return promiseResp
  }

  const startInstance = async (id: string) => {
    const status = await toggleInstance(id, 'start')
    return status as string
  }

  const stopInstance = async (id: string) => {
    const status = await toggleInstance(id, 'stop')
    return status as string
  }

  const startSystem = (system: System) => {
    system.instances.forEach((instance) => {
      toggleInstance(instance.id, 'start')
    })
  }

  const stopSystem = (system: System) => {
    system.instances.forEach((instance) => {
      toggleInstance(instance.id, 'stop')
    })
  }

  const reloadSystem = (systemId: string) => {
    const patchData = {
      operation: 'reload',
      withCredentials: authEnabled,
      value: systemId,
    }
    axiosInstance.patch<System[]>(`/api/v1/systems/${systemId}`, patchData)
  }

  const deleteSystem = (systemId: string) => {
    axiosInstance.delete<System[]>(`/api/v1/systems/${systemId}`, {
      withCredentials: authEnabled,
    })
  }

  return {
    stopSystem,
    startSystem,
    stopInstance,
    startInstance,
    getSystems,
    systems,
    reloadSystem,
    deleteSystem,
  }
}

export default useSystems
