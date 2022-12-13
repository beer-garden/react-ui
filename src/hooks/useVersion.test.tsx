import { waitFor } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { TVersionConfig } from 'test/test-values'
import { ConfigProviders } from 'test/testMocks'

import useVersion from './useVersion'

describe('useVersion', () => {
  test('gets version config', async () => {
    const { result } = renderHook(() => useVersion(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(() => {
      return result.current.getVersion()
    })
    await waitFor(() => {
      expect(response.data).toEqual(TVersionConfig)
    })
  })
})
