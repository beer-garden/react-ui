import { ServerConfigContainer } from 'containers/ConfigContainer'
import { useMyAxios } from 'hooks/useMyAxios'
import { VersionConfig } from 'types/config_types'

const useVersion = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const { axiosInstance } = useMyAxios()

  const getVersion = () => {
    return axiosInstance.get<VersionConfig>('/version', {
      withCredentials: authEnabled,
    })
  }

  return { getVersion }
}

export default useVersion
