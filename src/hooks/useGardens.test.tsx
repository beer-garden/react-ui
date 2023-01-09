import { waitFor } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { TGarden } from 'test/garden-test-values'
import { ConfigProviders } from 'test/testMocks'

import useGardens from './useGardens'

describe('useGardens', () => {
  test('gets garden list', async () => {
    const { result } = renderHook(() => useGardens(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(() => {
      return result.current.getGardens()
    })
    await waitFor(() => {
      expect(response.data).toEqual([TGarden])
    })
  })

  test('gets single garden', async () => {
    const { result } = renderHook(() => useGardens(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(() => {
      return result.current.getGarden(TGarden.name)
    })
    await waitFor(() => {
      expect(response.data).toEqual(TGarden)
    })
  })

  test('delete garden', async () => {
    const { result } = renderHook(() => useGardens(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(() => {
      return result.current.deleteGarden(TGarden.name)
    })
    await waitFor(() => {
      expect(response.data).toEqual({})
    })
  })

  test('syncs garden', async () => {
    const { result } = renderHook(() => useGardens(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(() => {
      return result.current.syncGarden(TGarden.name)
    })
    await waitFor(() => {
      expect(response.data).toEqual({})
    })
  })

  test('creates garden', async () => {
    const { result } = renderHook(() => useGardens(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(() => {
      return result.current.createGarden(TGarden)
    })
    await waitFor(() => {
      expect(response.data).toEqual(TGarden)
    })
  })

  test('syncs users', async () => {
    const { result } = renderHook(() => useGardens(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(() => {
      return result.current.syncUsers()
    })
    await waitFor(() => {
      expect(response.data).toEqual({})
    })
  })

  test('updates garden', async () => {
    const { result } = renderHook(() => useGardens(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(() => {
      return result.current.updateGarden(TGarden)
    })
    await waitFor(() => {
      expect(response.data).toEqual(TGarden)
    })
  })
})
