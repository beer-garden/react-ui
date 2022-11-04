import { waitFor } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { ConfigProviders } from 'test/testMocks'

import { useJobs } from './useJobs'

describe('useJobs', () => {
  test('gets job list', async () => {
    const { result } = renderHook(() => useJobs(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(
      () => {
        return result.current.getJobs(jest.fn())
      },
      { timeout: 2500 },
    )

    await waitFor(() => {
      expect(response).toEqual(undefined)
    })
  })

  test('gets job', async () => {
    const { result } = renderHook(() => useJobs(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(
      () => {
        return result.current.getJob(jest.fn(), '123test')
      },
      { timeout: 2500 },
    )

    await waitFor(() => {
      expect(response).toEqual(undefined)
    })
  })

  test('pause job', async () => {
    const { result } = renderHook(() => useJobs(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(
      () => {
        return result.current.pauseJob(jest.fn(), '123test')
      },
      { timeout: 2500 },
    )

    await waitFor(() => {
      expect(response).toEqual(undefined)
    })
  })

  test('resume job', async () => {
    const { result } = renderHook(() => useJobs(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(
      () => {
        return result.current.resumeJob(jest.fn(), '123test')
      },
      { timeout: 2500 },
    )

    await waitFor(() => {
      expect(response).toEqual(undefined)
    })
  })

  test('delete job', async () => {
    const { result } = renderHook(() => useJobs(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(
      () => {
        return result.current.deleteJob(jest.fn(), '123test')
      },
      { timeout: 2500 },
    )

    await waitFor(() => {
      expect(response).toEqual(undefined)
    })
  })

  test('run job', async () => {
    const { result } = renderHook(() => useJobs(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(
      () => {
        return result.current.runAdHoc('123test', false)
      },
      { timeout: 2500 },
    )

    await waitFor(() => {
      expect(response.status).toEqual(200)
    })
  })

  test('run interval job', async () => {
    const { result } = renderHook(() => useJobs(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(
      () => {
        return result.current.runAdHoc('123test', true)
      },
      { timeout: 2500 },
    )

    await waitFor(() => {
      expect(response.status).toEqual(200)
    })
  })
})
