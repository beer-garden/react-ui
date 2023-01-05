import { waitFor } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { useRunners } from 'hooks/useRunners'
import { mockAxios } from 'test/axios-mock'
import { TRunner } from 'test/system-test-values'
import { ConfigProviders } from 'test/testMocks'

describe('useRunners', () => {
  test('getRunners gets Runners', async () => {
    const { result } = renderHook(() => useRunners(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(() => {
      return result.current.getRunners()
    })
    await waitFor(() => {
      expect(response.data).toEqual([TRunner])
    })
  })

  test('reloadSystem reloads the runner', async () => {
    mockAxios.onGet('/api/vbeta/runners').reply(200, [TRunner])

    const { result } = renderHook(() => useRunners(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(() => {
      return result.current.getRunners()
    })
    await waitFor(() => {
      expect(response.data).toEqual([TRunner])
    })
    expect(response.data[0].stopped).toBe(false)

    const responseReload = await waitFor(() => {
      return result.current.reloadRunner(TRunner.path)
    })
    await waitFor(() => {
      expect(responseReload.data).toEqual([TRunner])
    })
  })

  test('deleteRunner deletes the runner', async () => {
    const { result } = renderHook(() => useRunners(), {
      wrapper: ConfigProviders,
    })

    const responseDelete = await waitFor(() => {
      return result.current.deleteRunner(TRunner.id)
    })
    await waitFor(() => {
      expect(responseDelete.data).toEqual(TRunner)
    })
  })
})
