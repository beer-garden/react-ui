import { AxiosPromise, AxiosRequestConfig } from 'axios'
import useAxios from 'axios-hooks'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { useMyAxios } from 'hooks/useMyAxios'
import { PatchData, System } from 'types/backend-types'
import { EmptyObject } from 'types/custom-types'

const useSystems = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const { axiosManualOptions } = useMyAxios()
  const [{ error }, execute] = useAxios({}, axiosManualOptions)

  const getSystems = (): AxiosPromise<System[]> => {
    const config: AxiosRequestConfig = {
      url: '/api/v1/systems',
      method: 'get',
      withCredentials: authEnabled,
    }

    return execute(config)
  }

  const reloadSystem = (systemId: string): AxiosPromise<System> => {
    const config: AxiosRequestConfig<PatchData> = {
      url: `/api/v1/systems/${systemId}`,
      method: 'patch',
      withCredentials: authEnabled,
      data: { operation: 'reload' },
    }

    return execute(config)
  }

  const deleteSystem = (systemId: string): AxiosPromise<EmptyObject> => {
    const config: AxiosRequestConfig = {
      url: `/api/v1/systems/${systemId}`,
      method: 'delete',
      withCredentials: authEnabled,
    }

    return execute(config)
  }

  return { error, getSystems, reloadSystem, deleteSystem }
}

export { useSystems }
