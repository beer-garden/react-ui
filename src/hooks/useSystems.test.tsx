import { waitFor } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { mockAxios } from 'test/axios-mock'
import { TInstance, TSystem } from 'test/system-test-values'
import { ConfigProviders } from 'test/testMocks'

import { useSystems } from './useSystems'

describe('useSystems', () => {
  test('getSystems gets systems', async () => {
    const { result } = renderHook(() => useSystems(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(() => {
      return result.current.getSystems()
    })
    await waitFor(() => {
      expect(response.data).toEqual([TSystem])
    })
  })

  // message body is empty
  test('reloadSystem reloads the system', async () => {
    const testInstance = Object.assign({}, TInstance, { status: 'STOPPED' })
    const testSystem = Object.assign({}, TSystem, { instances: [testInstance] })
    mockAxios.onGet('/api/v1/systems').reply(200, [testSystem])

    const { result } = renderHook(() => useSystems(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(() => {
      return result.current.getSystems()
    })
    await waitFor(() => {
      expect(response.data).toEqual([testSystem])
    })
    expect(response.data[0].instances[0].status).toBe('STOPPED')

    // reload the system
    const responseReload = await waitFor(() => {
      return result.current.reloadSystem(TSystem.id)
    })
    await waitFor(() => {
      expect(responseReload.data).toBe('')
    })

    mockAxios.onGet('/api/v1/systems').reply(200, [TSystem])

    // confirm that system was reloaded
    const responseAfterReload = await waitFor(() => {
      return result.current.getSystems()
    })
    await waitFor(() => {
      expect(responseAfterReload.data).toEqual([TSystem])
    })
    expect(responseAfterReload.data[0].instances[0].status).toBe('RUNNING')
  })

  test('deleteSystem deletes the system', async () => {
    const { result } = renderHook(() => useSystems(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(() => {
      return result.current.getSystems()
    })
    await waitFor(() => {
      expect(response.data).toEqual([TSystem])
    })

    // delete the system
    const responseDelete = await waitFor(() => {
      return result.current.deleteSystem(TSystem.id)
    })
    await waitFor(() => {
      expect(responseDelete.data).not.toBeDefined()
    })

    // confirm that system was deleted
    mockAxios.onGet('/api/v1/systems').reply(200, [])
    const responseAfterDelete = await waitFor(() => {
      return result.current.getSystems()
    })
    await waitFor(() => {
      expect(responseAfterDelete.data).toEqual([])
    })

    mockAxios.onGet('/api/v1/systems').reply(200, [TSystem])
  })
})
