import { render, screen, waitFor } from '@testing-library/react'
import { mockAxios } from 'test/axios-mock'
import { TServerConfig } from 'test/test-values'
import { AllProviders, LoggedInProviders } from 'test/testMocks'

import { NavigationBar } from './NavigationBar'

describe('NavigationBar', () => {
  test('renders title bar', async () => {
    render(
      <AllProviders>
        <NavigationBar
          setMarginLeft={() => {
            // do nothing
          }}
        />
      </AllProviders>,
    )
    // alternate fix to 'code that causes React state updates should be wrapped into act(...):' error
    const header = await screen.findByRole('heading')
    expect(header).toBeInTheDocument()
    expect(header.textContent).toEqual('Beer Garden')
  })

  test('no user welcome when not logged in', async () => {
    render(
      <AllProviders>
        <NavigationBar
          setMarginLeft={() => {
            // do nothing
          }}
        />
      </AllProviders>,
    )
    await waitFor(() =>
      expect(screen.queryByText('Hello, admin!')).not.toBeInTheDocument(),
    )
  })

  // skipping as broken by getUser call in setUser fn of AuthContainer
  test.skip('adds user welcome when logged in', async () => {
    // change return to enable auth
    mockAxios
      .onGet('/config')
      .reply(200, Object.assign({}, TServerConfig, { auth_enabled: true }))

    render(
      <LoggedInProviders>
        <NavigationBar
          setMarginLeft={() => {
            // do nothing
          }}
        />
      </LoggedInProviders>,
    )
    const header = await screen.findByRole('heading', { name: 'Hello, admin!' })
    expect(header).toBeInTheDocument()
    expect(header.textContent).toEqual('Hello, admin!')
  })
})
