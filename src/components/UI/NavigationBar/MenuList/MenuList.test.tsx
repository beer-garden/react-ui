import { render, screen, waitFor } from '@testing-library/react'
import { NavigationBarContextProvider } from 'components/UI/NavigationBar/NavigationBarContext'
import { AuthContainer } from 'containers/AuthContainer'
import { PermissionsContainer } from 'containers/PermissionsContainer'
import { AllProviders } from 'test/testMocks'
import { TUser } from 'test/user-test-values'

import { MenuList } from './MenuList'

describe('Menu List', () => {
  beforeEach(() => {
    jest.spyOn(AuthContainer, 'useContainer').mockReturnValue({
      user: TUser.username,
      login: jest.fn(),
      logout: jest.fn(),
      refreshToken: jest.fn(),
      isAuthenticated: jest.fn(),
      tokenExpiration: new Date(),
    })
  })

  describe('with permission', () => {
    beforeEach(() => {
      jest.spyOn(PermissionsContainer, 'useContainer').mockReturnValue({
        hasGardenPermission: jest.fn(),
        hasPermission: () => true,
        hasSystemPermission: jest.fn(),
        hasJobPermission: jest.fn(),
        isPermissionsSet: jest.fn(),
      })
    })

    test('should show logout button when logged in', async () => {
      render(
        <AllProviders>
          <NavigationBarContextProvider
            toggleDrawer={jest.fn()}
            drawerIsOpen={true}
          >
            <MenuList />
          </NavigationBarContextProvider>
        </AllProviders>,
      )
      await waitFor(() => {
        expect(screen.getByText('Logout')).toBeInTheDocument()
      })
    })

    test('should show admin menu', async () => {
      render(
        <AllProviders>
          <NavigationBarContextProvider
            toggleDrawer={jest.fn()}
            drawerIsOpen={true}
          >
            <MenuList />
          </NavigationBarContextProvider>
        </AllProviders>,
      )
      await waitFor(() => {
        expect(screen.getByText('Admin')).toBeInTheDocument()
      })
    })

    test('should show Scheduler option', async () => {
      render(
        <AllProviders>
          <NavigationBarContextProvider
            toggleDrawer={jest.fn()}
            drawerIsOpen={true}
          >
            <MenuList />
          </NavigationBarContextProvider>
        </AllProviders>,
      )
      await waitFor(() => {
        expect(screen.getByText('Scheduler')).toBeInTheDocument()
      })
    })
  })

  describe('without permission', () => {
    beforeEach(() => {
      jest.spyOn(PermissionsContainer, 'useContainer').mockReturnValue({
        hasGardenPermission: jest.fn(),
        hasPermission: () => false,
        hasSystemPermission: jest.fn(),
        hasJobPermission: jest.fn(),
        isPermissionsSet: jest.fn(),
      })
    })

    test('should hide Logout button when not logged in', async () => {
      jest.spyOn(AuthContainer, 'useContainer').mockReturnValue({
        user: null,
        login: jest.fn(),
        logout: jest.fn(),
        refreshToken: jest.fn(),
        isAuthenticated: jest.fn(),
        tokenExpiration: new Date(),
      })
      render(
        <AllProviders>
          <NavigationBarContextProvider
            toggleDrawer={jest.fn()}
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

    test('should not show admin menu when no permission', async () => {
      render(
        <AllProviders>
          <NavigationBarContextProvider
            toggleDrawer={jest.fn()}
            drawerIsOpen={true}
          >
            <MenuList />
          </NavigationBarContextProvider>
        </AllProviders>,
      )
      await waitFor(() => {
        expect(screen.queryByText('Admin')).not.toBeInTheDocument()
      })
    })

    test('should not show scheduler when no permission', async () => {
      render(
        <AllProviders>
          <NavigationBarContextProvider
            toggleDrawer={jest.fn()}
            drawerIsOpen={true}
          >
            <MenuList />
          </NavigationBarContextProvider>
        </AllProviders>,
      )
      await waitFor(() => {
        expect(screen.queryByText('Scheduler')).not.toBeInTheDocument()
      })
    })
  })
})
