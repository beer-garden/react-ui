import { render, screen, waitFor } from '@testing-library/react'
import { NavigationBarContextProvider } from 'components/UI/NavigationBar/NavigationBarContext'
import { mockAxios, regexUsers } from 'test/axios-mock'
import { TServerAuthConfig } from 'test/test-values'
import { AllProviders, LoggedInProviders } from 'test/testMocks'
import { TAdmin, TUser } from 'test/user-test-values'

import { MenuList } from './MenuList'

describe('Menu List', () => {
  test('should hide Logout button when not logged in', async () => {
    render(
      <AllProviders>
        <NavigationBarContextProvider
          toggleDrawer={(open: boolean) => () => {
            // noop
          }}
          drawerIsOpen={true}
        >
          <MenuList />
        </NavigationBarContextProvider>
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.queryByText('Logout')).not.toBeInTheDocument()
    })
  })

  test('should show logout button when logged in', async () => {
    mockAxios.onGet('/config').reply(200, TServerAuthConfig)

    render(
      <LoggedInProviders>
        <NavigationBarContextProvider
          toggleDrawer={(open: boolean) => () => {
            // noop
          }}
          drawerIsOpen={true}
        >
          <MenuList />
        </NavigationBarContextProvider>
      </LoggedInProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText('Logout')).toBeInTheDocument()
    })
  })

  test('should show admin menu when permission', async () => {
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
          <MenuList />
        </NavigationBarContextProvider>
      </LoggedInProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText('Admin')).toBeInTheDocument()
    })
  })

  test('should not show admin menu when no permission', async () => {
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
          <MenuList />
        </NavigationBarContextProvider>
      </LoggedInProviders>,
    )
    await waitFor(() => {
      expect(screen.queryByText('Admin')).not.toBeInTheDocument()
    })
  })
})
