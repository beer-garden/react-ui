import { ServerConfigContainer } from '../containers/ConfigContainer'
import { useMyAxios } from './useMyAxios'

const useAdmin = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const { axiosInstance } = useMyAxios()
  const rescanPluginDirectory = () => {
    const patchData = {
      operation: 'rescan',
      withCredentials: authEnabled,
    }
    axiosInstance.patch('/api/v1/admin', patchData)
  }
  return { rescanPluginDirectory }
}

export default useAdmin
