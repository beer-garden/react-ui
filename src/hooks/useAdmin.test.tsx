import { waitFor } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { ConfigProviders } from 'test/testMocks'

import useAdmin from './useAdmin'

describe('useAdmin', () => {
  test('rescans directory', async () => {
    const { result } = renderHook(() => useAdmin(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(() => {
      return result.current.rescanPluginDirectory()
    })
    await waitFor(() => {
      expect(response.data).toEqual({})
    })
  })
})
