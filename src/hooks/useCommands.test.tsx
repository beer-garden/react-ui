import { waitFor } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import Router from 'react-router-dom'
import { TSystem } from 'test/test-values'
import { ConfigProviders } from 'test/testMocks'

import { useCommands } from './useCommands'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}))

describe('useCommands', () => {
  afterAll(() => {
    jest.unmock('react-router-dom')
    jest.clearAllMocks()
  })

  test('provides system ID', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({
      systemName: TSystem.name,
      namespace: TSystem.namespace,
      version: TSystem.version,
    })
    const { result } = renderHook(() => useCommands(), {
      wrapper: ConfigProviders,
    })
    await waitFor(() => {
      expect(result.current.systemId).toEqual(TSystem.id)
    })
  })

  test('provides system name', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({
      systemName: TSystem.name,
      namespace: TSystem.namespace,
      version: TSystem.version,
    })
    const { result } = renderHook(() => useCommands(), {
      wrapper: ConfigProviders,
    })
    await waitFor(() => {
      expect(result.current.systemName).toEqual(TSystem.name)
    })
  })

  test('provides namespace', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({
      systemName: TSystem.name,
      namespace: TSystem.namespace,
      version: TSystem.version,
    })
    const { result } = renderHook(() => useCommands(), {
      wrapper: ConfigProviders,
    })
    await waitFor(() => {
      expect(result.current.namespace).toEqual(TSystem.namespace)
    })
  })

  test('provides system version', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({
      systemName: TSystem.name,
      namespace: TSystem.namespace,
      version: TSystem.version,
    })
    const { result } = renderHook(() => useCommands(), {
      wrapper: ConfigProviders,
    })
    await waitFor(() => {
      expect(result.current.version).toEqual(TSystem.version)
    })
  })
})
