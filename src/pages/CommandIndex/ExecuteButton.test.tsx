import { render, screen, waitFor } from '@testing-library/react'
import { mockAxios, regexUsers } from 'test/axios-mock'
import { TAugmentedCommand, TServerAuthConfig, TSystem } from 'test/test-values'
import { LoggedInProviders } from 'test/testMocks'
import { TAdmin, TUser } from 'test/user-test-values'

import { ExecuteButton } from './ExecuteButton'

describe('ExecuteButton', () => {
  test('execute button if permission', async () => {
    mockAxios.onGet('/config').reply(200, TServerAuthConfig)
    mockAxios.onGet(regexUsers).reply(200, TAdmin)
    render(
      <LoggedInProviders>
        <ExecuteButton system={TSystem} command={TAugmentedCommand} />
      </LoggedInProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText('Execute')).toBeInTheDocument()
    })
  })

  test('disabled execute button if no permission', async () => {
    mockAxios.onGet('/config').reply(200, TServerAuthConfig)
    mockAxios.onGet(regexUsers).reply(200, TUser)
    render(
      <LoggedInProviders>
        <ExecuteButton system={TSystem} command={TAugmentedCommand} />
      </LoggedInProviders>,
    )
    // check button is disabled, but its aria-disabled
    await waitFor(() => {
      expect(screen.queryByText('Execute')).toHaveAttribute(
        'aria-disabled',
        'true',
      )
    })
  })
})
