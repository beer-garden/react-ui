import { waitFor } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { ConfigProviders } from 'test/testMocks'

import useNamespace from './useNamespace'

describe('useNamespace', () => {
  test('gets namespace list', async () => {
    const { result } = renderHook(() => useNamespace(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(() => {
      return result.current.getNamespaces()
    })
    await waitFor(() => {
      expect(response.data).toEqual(['test'])
    })
  })
})
