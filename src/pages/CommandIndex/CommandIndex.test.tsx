import { render, screen, waitFor } from '@testing-library/react'
import Router from 'react-router-dom'
import { mockAxios, regexUsers } from 'test/axios-mock'
import { TSystem } from 'test/system-test-values'
import { TServerAuthConfig } from 'test/test-values'
import { AllProviders, LoggedInProviders } from 'test/testMocks'
import { TAdmin, TUser } from 'test/user-test-values'

import { CommandIndex } from './CommandIndex'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}))

describe('CommandIndex', () => {
  afterAll(() => {
    jest.unmock('react-router-dom')
    jest.clearAllMocks()
  })

  test('render table of commands', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({
      systemName: TSystem.name,
      namespace: TSystem.namespace,
      version: TSystem.version,
    })
    render(
      <AllProviders>
        <CommandIndex />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText('Commands')).toBeInTheDocument()
    })
  })

  test('execute button column if permission', async () => {
    mockAxios.onGet('/config').reply(200, TServerAuthConfig)
    mockAxios.onGet(regexUsers).reply(200, TAdmin)
    jest.spyOn(Router, 'useParams').mockReturnValue({
      systemName: TSystem.name,
      namespace: TSystem.namespace,
      version: TSystem.version,
    })
    render(
      <LoggedInProviders>
        <CommandIndex />
      </LoggedInProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText('Execute')).toBeInTheDocument()
    })
  })

  test('no execute column if no permission', async () => {
    mockAxios.onGet('/config').reply(200, TServerAuthConfig)
    mockAxios.onGet(regexUsers).reply(200, TUser)
    jest.spyOn(Router, 'useParams').mockReturnValue({
      systemName: TSystem.name,
      namespace: TSystem.namespace,
      version: TSystem.version,
    })
    render(
      <LoggedInProviders>
        <CommandIndex />
      </LoggedInProviders>,
    )
    await waitFor(() => {
      expect(screen.queryByText('Execute')).not.toBeInTheDocument()
    })
  })
})
