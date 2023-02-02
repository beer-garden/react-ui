import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { NavigationBarContextProvider } from 'components/UI/NavigationBar/NavigationBarContext'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { PermissionsContainer } from 'containers/PermissionsContainer'
import { TServerConfig } from 'test/test-values'
import { AllProviders } from 'test/testMocks'

import { AdminMenu } from './AdminMenu'

describe('Admin Menu', () => {
  beforeEach(() => {
    jest.spyOn(PermissionsContainer, 'useContainer').mockReturnValue({
      hasGardenPermission: jest.fn(),
      hasPermission: () => true,
      hasSystemPermission: jest.fn(),
      hasJobPermission: jest.fn(),
      isPermissionsSet: jest.fn(),
    })
    jest.spyOn(ServerConfigContainer, 'useContainer').mockReturnValue({
      config: TServerConfig,
      authEnabled: false,
      debugEnabled: false,
    })
  })

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

  test('lists main item links (no auth)', async () => {
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

  describe('menu items only for specific user access', () => {
    test('lists users', async () => {
      jest.spyOn(PermissionsContainer, 'useContainer').mockReturnValue({
        hasGardenPermission: jest.fn(),
        hasPermission: (p: string) => {
          return (
            ['user:update'].includes(p) ||
            Object.prototype.hasOwnProperty.call(['user:update'], p)
          )
        },
        hasSystemPermission: jest.fn(),
        hasJobPermission: jest.fn(),
        isPermissionsSet: jest.fn(),
      })
      jest.spyOn(ServerConfigContainer, 'useContainer').mockReturnValue({
        config: TServerConfig,
        authEnabled: true,
        debugEnabled: false,
      })
      render(
        <AllProviders>
          <NavigationBarContextProvider
            toggleDrawer={jest.fn()}
            drawerIsOpen={true}
          >
            <AdminMenu />
          </NavigationBarContextProvider>
        </AllProviders>,
      )
      fireEvent.click(screen.getByTestId('ExpandMoreIcon'))
      await waitFor(() => {
        expect(screen.getByText('Users')).toBeInTheDocument()
      })
      expect(
        screen.queryByText('Command Publishing Blocklist'),
      ).not.toBeInTheDocument()
      expect(screen.queryByText('Gardens')).not.toBeInTheDocument()
      expect(screen.queryByText('Systems')).not.toBeInTheDocument()
    })

    test('lists garden and blocklist', async () => {
      jest.spyOn(PermissionsContainer, 'useContainer').mockReturnValue({
        hasGardenPermission: jest.fn(),
        hasPermission: (p: string) => {
          return (
            ['garden:update'].includes(p) ||
            Object.prototype.hasOwnProperty.call(['garden:update'], p)
          )
        },
        hasSystemPermission: jest.fn(),
        hasJobPermission: jest.fn(),
        isPermissionsSet: jest.fn(),
      })
      render(
        <AllProviders>
          <NavigationBarContextProvider
            toggleDrawer={jest.fn()}
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
        expect(
          screen.getByText('Command Publishing Blocklist'),
        ).toBeInTheDocument()
      })
      expect(screen.queryByText('Users')).not.toBeInTheDocument()
      expect(screen.queryByText('Systems')).not.toBeInTheDocument()
    })

    test('lists system', async () => {
      jest.spyOn(PermissionsContainer, 'useContainer').mockReturnValue({
        hasGardenPermission: jest.fn(),
        hasPermission: (p: string) => {
          return (
            ['system:update'].includes(p) ||
            Object.prototype.hasOwnProperty.call(['system:update'], p)
          )
        },
        hasSystemPermission: jest.fn(),
        hasJobPermission: jest.fn(),
        isPermissionsSet: jest.fn(),
      })
      render(
        <AllProviders>
          <NavigationBarContextProvider
            toggleDrawer={jest.fn()}
            drawerIsOpen={true}
          >
            <AdminMenu />
          </NavigationBarContextProvider>
        </AllProviders>,
      )
      fireEvent.click(screen.getByTestId('ExpandMoreIcon'))
      await waitFor(() => {
        expect(screen.getByText('Systems')).toBeInTheDocument()
      })
      expect(
        screen.queryByText('Command Publishing Blocklist'),
      ).not.toBeInTheDocument()
      expect(screen.queryByText('Users')).not.toBeInTheDocument()
      expect(screen.queryByText('Gardens')).not.toBeInTheDocument()
    })
  })
})
