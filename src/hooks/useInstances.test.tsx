import { waitFor } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { mockAxios } from 'test/axios-mock'
import { TInstance } from 'test/test-values'
import { ConfigProviders } from 'test/testMocks'

import { useInstances } from './useInstances'

describe('useInstances', () => {
  test('startInstance starts an instance', async () => {
    const testInstance = Object.assign({}, TInstance, { status: 'STOPPED' })
    mockAxios.onPatch('/api/v1/instances/testinst').reply(200, testInstance)

    const { result } = renderHook(() => useInstances(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(
      () => {
        return result.current.startInstance('testinst')
      },
      { timeout: 2500 },
    )

    await waitFor(() => {
      expect(response).toEqual('RUNNING')
    })

    mockAxios.onPatch('/api/v1/instances/testinst').reply(200, TInstance)
  })

  test('stopInstance stops an instance', async () => {
    const testInstance = Object.assign({}, TInstance, { status: 'STOPPED' })
    mockAxios.onGet('/api/v1/instances/testinst').reply(200, testInstance)

    const { result } = renderHook(() => useInstances(), {
      wrapper: ConfigProviders,
    })
    const response = await waitFor(
      () => {
        return result.current.stopInstance('testinst')
      },
      { timeout: 2500 },
    )

    await waitFor(() => {
      expect(response).toEqual('STOPPED')
    })

    mockAxios.onGet('/api/v1/instances/testinst').reply(200, TInstance)
  })
})
