import { waitFor } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { TBlockedCommand, TBlocklist } from 'test/system-test-values'
import { ConfigProviders } from 'test/testMocks'
import { CommandIndexTableData } from 'types/custom-types'

import { useBlockList } from './useBlockList'

describe('useBlockList', () => {
  test('provides blocklist', async () => {
    const { result } = renderHook(() => useBlockList(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(() => {
      return result.current.getBlockList()
    })
    await waitFor(() => {
      expect(response.data).toEqual(TBlocklist)
    })
  })

  test('provides delete blocklist', async () => {
    const { result } = renderHook(() => useBlockList(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(() => {
      return result.current.deleteBlockList(TBlockedCommand.id)
    })
    await waitFor(() => {
      expect(response.data).toEqual(TBlockedCommand)
    })
  })

  test('provides add blocklist', async () => {
    const { result } = renderHook(() => useBlockList(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(() => {
      return result.current.addBlockList([
        Object.assign({}, TBlockedCommand, {
          id: undefined,
        }) as CommandIndexTableData,
      ])
    })
    await waitFor(() => {
      expect(response.data).toEqual(TBlocklist)
    })
  })
})
