import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { NavigationBarContextProvider } from 'components/UI/NavigationBar/NavigationBarContext'
import { mockAxios } from 'test/axios-mock'
import { TServerConfig } from 'test/test-values'
import { AllProviders, LoggedInProviders } from 'test/testMocks'

import { AdminMenu } from './AdminMenu'

describe('Admin Menu', () => {
  test('makes menu', () => {
    render(
      <AllProviders>
        <AdminMenu />
      </AllProviders>,
    )
    expect(screen.getByText('Admin')).toBeInTheDocument()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  test('can expand to show menu', async () => {
    render(
      <AllProviders>
        <NavigationBarContextProvider
          toggleDrawer={(open: boolean) => () => {
            // noop
          }}
          drawerIsOpen={true}
        >
          <AdminMenu />
        </NavigationBarContextProvider>
      </AllProviders>,
    )
    fireEvent.click(screen.getByTestId('ExpandMoreIcon'))
    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument()
    })
  })

  test('lists main item links', async () => {
    render(
      <AllProviders>
        <NavigationBarContextProvider
          toggleDrawer={(open: boolean) => () => {
            // noop
          }}
          drawerIsOpen={true}
        >
          <AdminMenu />
        </NavigationBarContextProvider>
      </AllProviders>,
    )
    fireEvent.click(screen.getByTestId('ExpandMoreIcon'))
    await waitFor(() => {
      expect(screen.getByText('Gardens')).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.getByText('Systems')).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(
        screen.getByText('Command Publishing Blocklist'),
      ).toBeInTheDocument()
    })
    expect(screen.queryByText('Users')).not.toBeInTheDocument()
  })

  // for some reason this doesn't pass but it should?
  test.skip('lists users when logged in', async () => {
    // change return to enable auth
    mockAxios
      .onGet('/config')
      .reply(200, Object.assign({}, TServerConfig, { auth_enabled: true }))

    render(
      <LoggedInProviders>
        <NavigationBarContextProvider
          toggleDrawer={(open: boolean) => () => {
            // noop
          }}
          drawerIsOpen={true}
        >
          <AdminMenu />
        </NavigationBarContextProvider>
      </LoggedInProviders>,
    )
    fireEvent.click(screen.getByTestId('ExpandMoreIcon'))
    await waitFor(() => {
      expect(screen.getByText('Gardens')).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.getByText('Systems')).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(
        screen.getByText('Command Publishing Blocklist'),
      ).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.getByText('Users')).toBeInTheDocument()
    })
  })
})
