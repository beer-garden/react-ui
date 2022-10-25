import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { NavigationBarContextProvider } from 'components/UI/NavigationBar/NavigationBarContext'
import { mockAxios, regexUsers } from 'test/axios-mock'
import { TServerAuthConfig } from 'test/test-values'
import { AllProviders, LoggedInProviders } from 'test/testMocks'
import { TAdmin, TUser } from 'test/user-test-values'

import { AdminMenu } from './AdminMenu'

describe('Admin Menu', () => {
  test('makes menu', async () => {
    render(
      <AllProviders>
        <AdminMenu />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText('Admin')).toBeInTheDocument()
    })
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

  test('lists users when logged in', async () => {
    // change return to enable auth
    mockAxios.onGet('/config').reply(200, TServerAuthConfig)
    mockAxios.onGet(regexUsers).reply(200, TAdmin)
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

  test('not list users when no permission', async () => {
    // change return to enable auth
    mockAxios.onGet('/config').reply(200, TServerAuthConfig)
    mockAxios.onGet(regexUsers).reply(200, TUser)
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
    expect(screen.queryByText('Users')).not.toBeInTheDocument()
  })
})
