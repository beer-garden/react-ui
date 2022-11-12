import { waitFor } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { TJob } from 'test/test-values'
import { ConfigProviders } from 'test/testMocks'

import { useJobs } from './useJobs'

describe('useJobs', () => {
  test('import job', async () => {
    const { result } = renderHook(() => useJobs(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(() => {
      return result.current.importJobs('123test')
    })
    await waitFor(() => {
      expect(response.data).toEqual({ ids: [TJob.id] })
    })
  })

  test('export job', async () => {
    const { result } = renderHook(() => useJobs(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(() => {
      return result.current.exportJobs()
    })
    await waitFor(() => {
      expect(response.data).toEqual([TJob])
    })
  })

  test('gets job list', async () => {
    const { result } = renderHook(() => useJobs(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(
      () => {
        return result.current.getJobs()
      },
      { timeout: 2500 },
    )

    await waitFor(() => {
      expect(response.data).toEqual([TJob])
    })
  })

  test('gets job', async () => {
    const { result } = renderHook(() => useJobs(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(
      () => {
        return result.current.getJob('123test')
      },
      { timeout: 2500 },
    )

    await waitFor(() => {
      expect(response.data).toEqual(TJob)
    })
  })

  test('pause job', async () => {
    const { result } = renderHook(() => useJobs(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(
      () => {
        return result.current.pauseJob('123test')
      },
      { timeout: 2500 },
    )

    await waitFor(() => {
      expect(response.data).toEqual(TJob)
    })
  })

  test('resume job', async () => {
    const { result } = renderHook(() => useJobs(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(
      () => {
        return result.current.resumeJob('123test')
      },
      { timeout: 2500 },
    )

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
    const response = await waitFor(
      () => {
        return result.current.deleteJob('123test')
      },
      { timeout: 2500 },
    )

    await waitFor(() => {
      expect(response.data).toEqual('')
    })
  })
})
