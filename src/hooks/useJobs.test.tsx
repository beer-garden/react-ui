import { waitFor } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { TJob } from 'test/test-values'
import { ConfigProviders } from 'test/testMocks'

import { useJobs } from './useJobs'

describe('useJobs', () => {
  test('gets job list', async () => {
    const { result } = renderHook(() => useJobs(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(() => {
      return result.current.getJobs()
    })

    await waitFor(() => {
      expect(response.data).toEqual([TJob])
    })
  })

  test('gets job', async () => {
    const { result } = renderHook(() => useJobs(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(() => {
      return result.current.getJob('123test')
    })

    await waitFor(() => {
      expect(response.data).toEqual(TJob)
    })
  })

  test('pause job', async () => {
    const { result } = renderHook(() => useJobs(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(() => {
      return result.current.pauseJob('123test')
    })

    await waitFor(() => {
      expect(response.data).toEqual(TJob)
    })
  })

  test('resume job', async () => {
    const { result } = renderHook(() => useJobs(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(() => {
      return result.current.resumeJob('123test')
    })

    await waitFor(() => {
      expect(response.data).toEqual(
        Object.assign({}, TJob, { status: 'PAUSED' }),
      )
    })
  })

  test('delete job', async () => {
    const { result } = renderHook(() => useJobs(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(() => {
      return result.current.deleteJob('123test')
    })

    await waitFor(() => {
      expect(response.data).toEqual('')
    })
  })
})
