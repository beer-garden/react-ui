import { render, screen, waitFor } from '@testing-library/react'
import { NavigationBarContextProvider } from 'components/UI/NavigationBar/NavigationBarContext'
import { mockAxios } from 'test/axios-mock'
import { TServerConfig } from 'test/test-values'
import { AllProviders, LoggedInProviders } from 'test/testMocks'

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
          <MenuList />
        </NavigationBarContextProvider>
      </LoggedInProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText('Logout')).toBeInTheDocument()
    })
  })
})
