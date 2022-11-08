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
})
