import { AxiosPromise, AxiosRequestConfig } from 'axios'
import useAxios from 'axios-hooks'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { useMyAxios } from 'hooks/useMyAxios'
import { PatchData } from 'types/backend-types'
import { EmptyObject } from 'types/custom-types'

const useAdmin = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const { axiosManualOptions } = useMyAxios()
  const [, execute] = useAxios({}, axiosManualOptions)

  const rescanPluginDirectory = (): AxiosPromise<EmptyObject> => {
    const patchData = {
      operation: 'rescan',
    }
    const config: AxiosRequestConfig<PatchData> = {
      url: '/api/v1/admin',
      method: 'patch',
      withCredentials: authEnabled,
      data: patchData,
    }

    return execute(config)
  }
  return { rescanPluginDirectory }
}

export default useAdmin
