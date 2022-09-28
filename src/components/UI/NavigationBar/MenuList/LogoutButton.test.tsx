import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { NavigationBarContextProvider } from 'components/UI/NavigationBar/NavigationBarContext'
import { mockAxios } from 'test/axios-mock'
import { TServerConfig } from 'test/test-values'
import { LoggedInProviders } from 'test/testMocks'

import { MenuList } from './MenuList'

describe('LogoutButton', () => {
  test('logs user out when clicked', async () => {
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

    const logOutButton = screen.getByText('Logout')
    fireEvent.click(logOutButton)

    await waitFor(() => {
      expect(screen.queryByText('Logout')).not.toBeInTheDocument()
    })
  })
})
