import { render, screen, waitFor } from '@testing-library/react'
import { mockAxios, regexUsers } from 'test/axios-mock'
import { TServerAuthConfig, TSystem } from 'test/test-values'
import { LoggedInProviders } from 'test/testMocks'
import { TAdmin, TUser } from 'test/user-test-values'

import { NamespaceCard } from './NamespaceCard'

describe('NamespaceCard', () => {
  test('renders card if permission', async () => {
    mockAxios.onGet('/config').reply(200, TServerAuthConfig)
    mockAxios.onGet(regexUsers).reply(200, TAdmin)
    render(
      <LoggedInProviders>
        <NamespaceCard namespace={TSystem.namespace} />
      </LoggedInProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText(TSystem.namespace)).toBeInTheDocument()
    })
  })

  test('does not render if no permission', async () => {
    mockAxios.onGet('/config').reply(200, TServerAuthConfig)
    mockAxios.onGet(regexUsers).reply(200, TUser)
    render(
      <LoggedInProviders>
        <NamespaceCard namespace={TSystem.namespace} />
      </LoggedInProviders>,
    )
    await waitFor(() => {
      expect(screen.queryByText(TSystem.namespace)).not.toBeInTheDocument()
    })
  })
})
