import { waitFor } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { TInstance } from 'test/system-test-values'
import { TQueue } from 'test/test-values'
import { ConfigProviders } from 'test/testMocks'

import useQueue from './useQueue'

describe('useQueue', () => {
  test('gets queue list', async () => {
    const { result } = renderHook(() => useQueue(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(() => {
      return result.current.getQueues()
    })
    await waitFor(() => {
      expect(response.data).toEqual([TQueue])
    })
  })

  test('clear single queue', async () => {
    const { result } = renderHook(() => useQueue(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(() => {
      return result.current.clearQueue(TQueue.name)
    })
    await waitFor(() => {
      expect(response.data).toEqual([TQueue])
    })
  })

  test('get queues for an instance', async () => {
    const { result } = renderHook(() => useQueue(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(() => {
      return result.current.getInstanceQueues(TInstance.id)
    })
    await waitFor(() => {
      expect(response.data).toEqual([TQueue])
    })
  })

  test('clears all queues garden', async () => {
    const { result } = renderHook(() => useQueue(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(() => {
      return result.current.clearQueues()
    })
    await waitFor(() => {
      expect(response.data).toEqual([TQueue])
    })
  })
})
