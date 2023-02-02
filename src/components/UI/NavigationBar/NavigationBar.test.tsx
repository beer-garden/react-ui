import { render, screen, waitFor } from '@testing-library/react'
import { Routes } from 'components/Routes'
import { AuthContainer } from 'containers/AuthContainer'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { PermissionsContainer } from 'containers/PermissionsContainer'
import { Suspense } from 'react'
import { TServerConfig } from 'test/test-values'
import { AllProviders } from 'test/testMocks'

import { NavigationBar } from './NavigationBar'

const originalLocation = Object.assign({}, window.location)

describe('NavigationBar', () => {
  beforeEach(() => {
    jest.spyOn(AuthContainer, 'useContainer').mockReturnValue({
      user: 'admin',
      login: jest.fn(),
      logout: jest.fn(),
      refreshToken: jest.fn(),
      isAuthenticated: () => true,
      tokenExpiration: new Date(),
    })
    jest.spyOn(PermissionsContainer, 'useContainer').mockReturnValue({
      hasGardenPermission: jest.fn(),
      hasPermission: () => true,
      hasSystemPermission: jest.fn(),
      hasJobPermission: jest.fn(),
      isPermissionsSet: () => true,
    })
  })

  test('renders title bar', async () => {
    render(
      <AllProviders>
        <NavigationBar setMarginLeft={jest.fn()} />
      </AllProviders>,
    )
    // alternate fix to 'code that causes React state updates should be wrapped into act(...):' error
    const header = await screen.findByRole('heading')
    expect(header).toBeInTheDocument()
    expect(header.textContent).toEqual('Beer Garden')
  })

  describe('url manipulation workaround', () => {
    let warnSpy: jest.SpyInstance

    beforeAll(() => {
      // hides page does not exist warning log we don't really care about
      // since Router handles redirect
      warnSpy = jest.spyOn(console, 'warn')
    })

    beforeEach(() => {
      jest.spyOn(PermissionsContainer, 'useContainer').mockReturnValue({
        hasGardenPermission: jest.fn(),
        hasPermission: () => true,
        hasSystemPermission: jest.fn(),
        hasJobPermission: jest.fn(),
        isPermissionsSet: () => true,
      })
      jest.spyOn(ServerConfigContainer, 'useContainer').mockReturnValue({
        config: TServerConfig,
        authEnabled: true,
        debugEnabled: false,
      })
    })

    afterEach(() => {
      window.location = { ...originalLocation }
      window.location.hash = '#/'
      window.location.pathname = '/'
    })

    afterAll(() => {
      warnSpy.mockClear()
    })

    test('redirects to correct page if given', async () => {
      window.location.hash = '#first/requests'
      render(
        <AllProviders>
          <NavigationBar setMarginLeft={jest.fn()} />
        </AllProviders>,
      )
      await waitFor(() => expect(window.location.hash).toEqual('#/requests'))
    })

    test.each(['#first/systems', '#second/', '#/other', '#again/bad'])(
      'redirects to systems page on bad hash %s',
      async (url) => {
        window.location.hash = url
        render(
          <AllProviders>
            <>
              <NavigationBar setMarginLeft={jest.fn()} />
              <Suspense fallback={'loading'}>
                <Routes />
              </Suspense>
            </>
          </AllProviders>,
        )
        await waitFor(() => expect(window.location.hash).toEqual('#/systems'))
      },
    )

    test.each(['something', 'other/', '/test/'])(
      'does not remove pathname %s',
      async (url) => {
        Object.defineProperty(window, 'location', {
          value: {
            ...originalLocation,
            hash: '#/',
          },
          writable: true,
        })
        window.location.pathname = url
        render(
          <AllProviders>
            <NavigationBar setMarginLeft={jest.fn()} />
          </AllProviders>,
        )
        await waitFor(() => expect(window.location.pathname).not.toEqual('/'))
        expect(window.location.pathname).toEqual(url)
      },
    )
  })

  test('no user welcome when not logged in', async () => {
    jest.spyOn(ServerConfigContainer, 'useContainer').mockReturnValue({
      config: null,
      authEnabled: false,
      debugEnabled: false,
    })
    render(
      <AllProviders>
        <NavigationBar setMarginLeft={jest.fn()} />
      </AllProviders>,
    )
    await waitFor(() =>
      expect(screen.queryByText('Hello, admin!')).not.toBeInTheDocument(),
    )
  })

  test('adds user welcome when logged in', async () => {
    jest.spyOn(ServerConfigContainer, 'useContainer').mockReturnValue({
      config: null,
      authEnabled: true,
      debugEnabled: false,
    })
    render(
      <AllProviders>
        <NavigationBar setMarginLeft={jest.fn()} />
      </AllProviders>,
    )
    const header = await screen.findByRole('heading', { name: 'Hello, admin!' })
    expect(header).toBeInTheDocument()
    expect(header.textContent).toEqual('Hello, admin!')
  })
})
