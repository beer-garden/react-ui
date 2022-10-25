import { waitFor } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { ConfigProviders } from 'test/testMocks'
import {
  TAdmin,
  TAdminRole,
  TRole,
  TUser,
  TUserPatch,
} from 'test/user-test-values'

import useUsers from './useUsers'

describe('useUsers', () => {
  test('getUsers gets users', async () => {
    const { result } = renderHook(() => useUsers(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(() => {
      return result.current.getUsers()
    })
    await waitFor(() => {
      expect(response.data).toEqual({ users: [TUser] })
    })
  })

  test('getUser gets single user', async () => {
    const { result } = renderHook(() => useUsers(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(() => {
      return result.current.getUser('someUser')
    })
    await waitFor(() => {
      expect(response.data).toEqual(TUser)
    })
  })

  test('createUser makes a user', async () => {
    const { result } = renderHook(() => useUsers(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(() => {
      return result.current.createUser('newUser', 'myPassword')
    })
    await waitFor(() => {
      expect(response.data).toEqual({ users: [TAdmin] })
    })
  })

  test('deleteUser deletes user', async () => {
    const { result } = renderHook(() => useUsers(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(() => {
      return result.current.deleteUser(TUser.username)
    })
    await waitFor(() => {
      expect(response.data).toEqual('')
    })
  })

  test('updateUser updates user', async () => {
    const { result } = renderHook(() => useUsers(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(() => {
      return result.current.updateUser(TUser.username, TUserPatch)
    })
    await waitFor(() => {
      expect(response.data).toEqual(TUser)
    })
  })

  test('getRoles gets list of roles', async () => {
    const { result } = renderHook(() => useUsers(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(() => {
      return result.current.getRoles()
    })
    await waitFor(() => {
      expect(response.data).toEqual({ roles: [TRole, TAdminRole] })
    })
  })
})
