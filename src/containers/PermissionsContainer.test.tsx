import { waitFor } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { AuthContainer } from 'containers/AuthContainer'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { mockAxios, regexUsers } from 'test/axios-mock'
import { TGarden } from 'test/garden-test-values'
import { TSystem } from 'test/system-test-values'
import { TJob, TServerAuthConfig, TServerConfig } from 'test/test-values'
import { AllProviders, LogsProvider } from 'test/testMocks'
import { TAdmin, TUser } from 'test/user-test-values'

import { PermissionsContainer } from './PermissionsContainer'

let consoleSpy: jest.SpyInstance

describe('Permissions Container', () => {
  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(jest.fn())
  })

  afterEach(() => {
    consoleSpy.mockClear()
  })

  afterAll(() => {
    consoleSpy.mockRestore()
  })

  test('logs if enabled', async () => {
    const { result } = renderHook(() => PermissionsContainer.useContainer(), {
      wrapper: ({ children }: { children: JSX.Element }) => (
        <LogsProvider logs={{ PERMISSION: true }}>{children}</LogsProvider>
      ),
    })
    await waitFor(() => {
      expect(result.current.hasPermission('user:create')).toBeTruthy()
    })
    expect(consoleSpy).toHaveBeenCalledWith('Setting user perms', undefined)
    expect(consoleSpy).toHaveBeenCalledWith('authEnabled', false)
    expect(consoleSpy).toHaveBeenCalledWith('globalPerms', undefined)
    expect(consoleSpy).toHaveBeenCalledWith('domainPerms', undefined)
  })

  test('no logs if disabled', async () => {
    const { result } = renderHook(() => PermissionsContainer.useContainer(), {
      wrapper: AllProviders,
    })
    const permission = result.current.hasPermission('user:create')
    await waitFor(() => {
      expect(permission).toBeTruthy()
    })
    expect(consoleSpy).toHaveBeenCalledTimes(0)
  })

  describe('no auth', () => {
    beforeEach(() => {
      jest.spyOn(ServerConfigContainer, 'useContainer').mockReturnValue({
        config: TServerConfig,
        authEnabled: false,
        debugEnabled: false,
      })
    })

    test('checks base permission', async () => {
      const { result } = renderHook(() => PermissionsContainer.useContainer(), {
        wrapper: AllProviders,
      })
      await waitFor(() => {
        expect(result.current.hasPermission('user:create')).toBeTruthy()
      })
    })

    test('checks garden permission', async () => {
      const { result } = renderHook(() => PermissionsContainer.useContainer(), {
        wrapper: AllProviders,
      })
      await waitFor(() => {
        expect(
          result.current.hasGardenPermission('user:create', TGarden),
        ).toBeTruthy()
      })
    })

    test('checks system permission', async () => {
      const { result } = renderHook(() => PermissionsContainer.useContainer(), {
        wrapper: AllProviders,
      })
      await waitFor(async () => {
        expect(
          await result.current.hasSystemPermission(
            'user:create',
            TSystem.id,
          ),
        ).toBeTruthy()
      })
    })

    test('checks job permission', async () => {
      const { result } = renderHook(() => PermissionsContainer.useContainer(), {
        wrapper: AllProviders,
      })
      await waitFor(async () => {
        expect(
          await result.current.hasJobPermission('user:create', TJob),
        ).toBeTruthy()
      })
    })
  })

  describe('auth no permissions', () => {
    beforeEach(() => {
      jest.spyOn(ServerConfigContainer, 'useContainer').mockReturnValue({
        config: TServerAuthConfig,
        authEnabled: true,
        debugEnabled: false,
      })
    })

    test('checks base permission', async () => {
      const { result } = renderHook(() => PermissionsContainer.useContainer(), {
        wrapper: AllProviders,
      })
      await waitFor(() => {
        expect(result.current.hasPermission('user:create')).toBeFalsy()
      })
    })

    test('checks garden permission', async () => {
      const { result } = renderHook(() => PermissionsContainer.useContainer(), {
        wrapper: AllProviders,
      })
      await waitFor(() => {
        expect(
          result.current.hasGardenPermission('user:create', TGarden),
        ).toBeFalsy()
      })
    })

    test('checks system permission', async () => {
      const { result } = renderHook(() => PermissionsContainer.useContainer(), {
        wrapper: AllProviders,
      })
      await waitFor(async () => {
        expect(
          await result.current.hasSystemPermission(
            'user:create',
            TSystem.id,
          ),
        ).toBeFalsy()
      })
    })

    test('checks job permission', async () => {
      const { result } = renderHook(() => PermissionsContainer.useContainer(), {
        wrapper: AllProviders,
      })
      await waitFor(async () => {
        expect(
          await result.current.hasJobPermission('user:create', TJob),
        ).toBeFalsy()
      })
    })
  })

  describe('auth logged in with permission', () => {
    beforeEach(() => {
      jest.spyOn(ServerConfigContainer, 'useContainer').mockReturnValue({
        config: TServerAuthConfig,
        authEnabled: true,
        debugEnabled: false,
      })
      jest.spyOn(AuthContainer, 'useContainer').mockReturnValue({
        user: 'admin',
        login: jest.fn(),
        logout: jest.fn(),
        refreshToken: jest.fn(),
        isAuthenticated: jest.fn(),
        tokenExpiration: new Date(),
      })
    })

    beforeAll(() => {
      mockAxios.onGet(regexUsers).reply(200, TAdmin)
    })

    test('checks base permission', async () => {
      const { result } = renderHook(() => PermissionsContainer.useContainer(), {
        wrapper: AllProviders,
      })
      await waitFor(() => {
        expect(result.current.hasPermission('user:create')).toBeTruthy()
      })
    })

    test('checks garden permission', async () => {
      const { result } = renderHook(() => PermissionsContainer.useContainer(), {
        wrapper: AllProviders,
      })
      await waitFor(() => {
        expect(
          result.current.hasGardenPermission('user:create', TGarden),
        ).toBeTruthy()
      })
    })

    test('checks system permission', async () => {
      const { result } = renderHook(() => PermissionsContainer.useContainer(), {
        wrapper: AllProviders,
      })
      await waitFor(async () => {
        expect(
          await result.current.hasSystemPermission(
            'user:create',
            TSystem.id,
          ),
        ).toBeTruthy()
      })
    })

    test('checks job permission', async () => {
      const { result } = renderHook(() => PermissionsContainer.useContainer(), {
        wrapper: AllProviders,
      })
      await waitFor(async () => {
        expect(
          await result.current.hasJobPermission('user:create', TJob),
        ).toBeTruthy()
      })
    })
  })

  describe('auth logged in without permission', () => {
    beforeEach(() => {
      jest.spyOn(ServerConfigContainer, 'useContainer').mockReturnValue({
        config: TServerAuthConfig,
        authEnabled: true,
        debugEnabled: false,
      })
      jest.spyOn(AuthContainer, 'useContainer').mockReturnValue({
        user: TUser.username,
        login: jest.fn(),
        logout: jest.fn(),
        refreshToken: jest.fn(),
        isAuthenticated: jest.fn(),
        tokenExpiration: new Date(),
      })
    })

    beforeAll(() => {
      mockAxios.onGet(regexUsers).reply(200, TUser)
    })

    test('checks base permission', async () => {
      const { result } = renderHook(() => PermissionsContainer.useContainer(), {
        wrapper: AllProviders,
      })
      await waitFor(() => {
        expect(result.current.hasPermission('user:create')).toBeFalsy()
      })
    })

    test('checks garden permission', async () => {
      const { result } = renderHook(() => PermissionsContainer.useContainer(), {
        wrapper: AllProviders,
      })
      await waitFor(() => {
        expect(
          result.current.hasGardenPermission('user:create', TGarden),
        ).toBeFalsy()
      })
    })

    test('checks system permission', async () => {
      const { result } = renderHook(() => PermissionsContainer.useContainer(), {
        wrapper: AllProviders,
      })
      await waitFor(async () => {
        expect(
          await result.current.hasSystemPermission(
            'user:create',
            TSystem.id,
          ),
        ).toBeFalsy()
      })
    })

    test('checks job permission', async () => {
      const { result } = renderHook(() => PermissionsContainer.useContainer(), {
        wrapper: AllProviders,
      })
      await waitFor(async () => {
        expect(
          await result.current.hasJobPermission('user:create', TJob),
        ).toBeFalsy()
      })
    })
  })
})
