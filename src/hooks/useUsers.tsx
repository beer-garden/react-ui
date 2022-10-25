import { AxiosRequestConfig } from 'axios'
import useAxios from 'axios-hooks'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { useMyAxios } from 'hooks/useMyAxios'
import { UserPatch } from 'types/backend-types'

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

  const getUser = (name: string) => {
    const config: AxiosRequestConfig = {
      url: `/api/v1/users/${name}`,
      method: 'get',
      withCredentials: authEnabled,
    }

    return execute(config)
  }

  const deleteUser = (name: string) => {
    const config: AxiosRequestConfig = {
      url: `/api/v1/users/${name}`,
      method: 'delete',
      withCredentials: authEnabled,
    }

    return execute(config)
  }

  const updateUser = (name: string, data: UserPatch) => {
    const config: AxiosRequestConfig = {
      url: `/api/v1/users/${name}`,
      method: 'patch',
      withCredentials: authEnabled,
      data,
    }

    return execute(config)
  }

  const getRoles = () => {
    const config: AxiosRequestConfig = {
      url: '/api/v1/roles',
      method: 'get',
      withCredentials: authEnabled,
    }

    return execute(config)
  }

  const createUser = (name: string, pw: string) => {
    const config: AxiosRequestConfig = {
      url: '/api/v1/users',
      method: 'post',
      withCredentials: authEnabled,
      data: {
        username: name,
        password: pw,
      },
    }

    return execute(config)
  }

  return { getUsers, getRoles, getUser, deleteUser, createUser, updateUser }
}

export default useUsers
