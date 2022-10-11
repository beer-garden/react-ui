import { waitFor } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { ConfigProviders } from 'test/testMocks'
import { TAdmin, TUser } from 'test/user-test-values'

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
      return result.current.getUser('adminUser')
    })
    await waitFor(() => {
      expect(response.data).toEqual({ users: [TAdmin] })
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
})
