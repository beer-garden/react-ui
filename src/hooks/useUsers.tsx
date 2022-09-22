import { AxiosRequestConfig } from 'axios'
import useAxios from 'axios-hooks'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { useMyAxios } from 'hooks/useMyAxios'

const useUsers = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const { axiosManualOptions } = useMyAxios()
  const [, execute] = useAxios({}, axiosManualOptions)

  const getUsers = () => {
    const config: AxiosRequestConfig = {
      url: '/api/v1/users',
      method: 'get',
      withCredentials: authEnabled,
    }

    return execute(config)
  }
  return { getUsers }
}

export default useUsers
