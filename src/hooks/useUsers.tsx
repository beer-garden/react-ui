import { AxiosPromise, AxiosRequestConfig } from 'axios'
import useAxios from 'axios-hooks'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { useMyAxios } from 'hooks/useMyAxios'
import { Role, User, UserPatch } from 'types/backend-types'
import { EmptyObject } from 'types/custom-types'

const useUsers = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const { axiosManualOptions } = useMyAxios()
  const [, execute] = useAxios({}, axiosManualOptions)

  const getUsers = (): AxiosPromise<{ users: User[] }> => {
    const config: AxiosRequestConfig = {
      url: '/api/v1/users',
      method: 'get',
      withCredentials: authEnabled,
    }

    return execute(config)
  }

  const getUser = (name: string): AxiosPromise<User> => {
    const config: AxiosRequestConfig = {
      url: `/api/v1/users/${name}`,
      method: 'get',
      withCredentials: authEnabled,
    }

    return execute(config)
  }

  const deleteUser = (name: string): AxiosPromise<EmptyObject> => {
    const config: AxiosRequestConfig = {
      url: `/api/v1/users/${name}`,
      method: 'delete',
      withCredentials: authEnabled,
    }

    return execute(config)
  }

  const updateUser = (name: string, data: UserPatch): AxiosPromise<User> => {
    const config: AxiosRequestConfig<UserPatch> = {
      url: `/api/v1/users/${name}`,
      method: 'patch',
      withCredentials: authEnabled,
      data,
    }

    return execute(config)
  }

  const getRoles = (): AxiosPromise<{ roles: Role[] }> => {
    const config: AxiosRequestConfig = {
      url: '/api/v1/roles',
      method: 'get',
      withCredentials: authEnabled,
    }

    return execute(config)
  }

  const createUser = (name: string, pw: string): AxiosPromise<User> => {
    const config: AxiosRequestConfig<{ password: string; username: string }> = {
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
