import ErrorBoundary from 'components/ErrorBoundary'
import { AuthContainer } from 'containers/AuthContainer'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { DebugContainer } from 'containers/DebugContainer'
import { PermissionsContainer } from 'containers/PermissionsContainer'
import { SocketContainer } from 'containers/SocketContainer'
import { Suspense } from 'react'
import { HashRouter, MemoryRouter } from 'react-router-dom'
import { DebugSettings } from 'types/config-types'

export interface ProviderMocks {
  children: JSX.Element
  startLocation?: string[]
  user?: string
  pw?: string
  logs?: DebugSettings
}

/**
 * Wrapper that puts children inside all props needed to render app properly
 * @param children Component(s) to render as children
 * @returns
 */
export const AllProviders = ({ children }: ProviderMocks) => {
  return (
    <HashRouter>
      <ServerConfigContainer.Provider>
        <DebugContainer.Provider>
          <SocketContainer.Provider>
            <AuthContainer.Provider>
              <PermissionsContainer.Provider>
                {children}
              </PermissionsContainer.Provider>
            </AuthContainer.Provider>
          </SocketContainer.Provider>
        </DebugContainer.Provider>
      </ServerConfigContainer.Provider>
    </HashRouter>
  )
}

/**
 * Wrapper that puts children inside all props needed to render app properly
 * using MemoryRouter so a current page location can be given
 * @param children Component(s) to render as children
 * @param startLocation String path for page URL when test runs
 * @returns
 */
export const MemoryProvider = ({ children, startLocation }: ProviderMocks) => {
  return (
    <MemoryRouter initialEntries={startLocation}>
      <ErrorBoundary>
        <ServerConfigContainer.Provider>
          <DebugContainer.Provider>
            <SocketContainer.Provider>
              <AuthContainer.Provider>
                <PermissionsContainer.Provider>
                  <Suspense fallback={<>LOADING...</>}>{children}</Suspense>
                </PermissionsContainer.Provider>
              </AuthContainer.Provider>
            </SocketContainer.Provider>
          </DebugContainer.Provider>
        </ServerConfigContainer.Provider>
      </ErrorBoundary>
    </MemoryRouter>
  )
}

/**
 * Wrapper that puts children inside all props needed to render app properly
 * using MemoryRouter so a current page location can be given and username/password
 * to login with
 * @param children Component(s) to render as children
 * @param startLocation String path for page URL when test runs
 * @returns
 */
export const LoggedInMemory = ({
  children,
  startLocation,
  user,
  pw,
}: ProviderMocks) => {
  return (
    <MemoryRouter initialEntries={startLocation}>
      <ErrorBoundary>
        <ServerConfigContainer.Provider>
          <DebugContainer.Provider>
            <SocketContainer.Provider>
              <AuthContainer.Provider>
                <PermissionsContainer.Provider>
                  <LoginProvider user={user} pw={pw}>
                    <Suspense fallback={<>LOADING...</>}>{children}</Suspense>
                  </LoginProvider>
                </PermissionsContainer.Provider>
              </AuthContainer.Provider>
            </SocketContainer.Provider>
          </DebugContainer.Provider>
        </ServerConfigContainer.Provider>
      </ErrorBoundary>
    </MemoryRouter>
  )
}

/**
 * Wrapper that just has config provider
 * @param children Component(s) to render as children
 * @returns
 */
export const ConfigProviders = ({ children }: ProviderMocks) => {
  return (
    <ServerConfigContainer.Provider>{children}</ServerConfigContainer.Provider>
  )
}

/**
 * Wrapper that puts children inside all props needed to render app properly
 * AND has a Suspense fallback
 * @param children Component(s) to render as children
 * @returns
 */
export const SuspendedProviders = ({ children }: ProviderMocks) => {
  return (
    <HashRouter>
      <ErrorBoundary>
        <ServerConfigContainer.Provider>
          <DebugContainer.Provider>
            <SocketContainer.Provider>
              <AuthContainer.Provider>
                <PermissionsContainer.Provider>
                  <Suspense fallback={<>LOADING...</>}>{children}</Suspense>
                </PermissionsContainer.Provider>
              </AuthContainer.Provider>
            </SocketContainer.Provider>
          </DebugContainer.Provider>
        </ServerConfigContainer.Provider>
      </ErrorBoundary>
    </HashRouter>
  )
}

/**
 * Wrapper that puts children inside all props needed to render app properly
 * AND logs in as admin user
 * @param children Component(s) to render as children
 * @returns
 */
export const LoggedInProviders = ({ children }: ProviderMocks) => {
  return (
    <HashRouter>
      <ErrorBoundary>
        <ServerConfigContainer.Provider>
          <DebugContainer.Provider>
            <SocketContainer.Provider>
              <AuthContainer.Provider>
                <PermissionsContainer.Provider>
                  <LoginProvider>{children}</LoginProvider>
                </PermissionsContainer.Provider>
              </AuthContainer.Provider>
            </SocketContainer.Provider>
          </DebugContainer.Provider>
        </ServerConfigContainer.Provider>
      </ErrorBoundary>
    </HashRouter>
  )
}

const LoginProvider = ({ children, user, pw }: ProviderMocks) => {
  const { login } = AuthContainer.useContainer()
  const userName = user || 'admin'
  const password = pw || 'password'
  login(userName, password)
    .then(() => {
      // do nothing its a test
    })
    .catch((E) => {
      // swallowing Error { message: "Invalid token specified: Cannot read
      // properties of undefined (reading 'replace')" }
    })
  return <>{children}</>
}

/**
 * Wrapper that only has socket provider and what it needs to run
 * not authenticated, with logs on
 * @param children
 * @returns
 */
export const SocketProvider = ({ children }: ProviderMocks) => {
  return (
    <DebugContainer.Provider initialState={{ SOCKET: true }}>
      <SocketContainer.Provider>{children}</SocketContainer.Provider>
    </DebugContainer.Provider>
  )
}

/**
 * Wrapper that uses AllProviders but with logs on
 * @param children
 * @returns
 */
export const LogsProvider = ({ children, logs }: ProviderMocks) => {
  return (
    <HashRouter>
      <ServerConfigContainer.Provider>
        <DebugContainer.Provider initialState={logs}>
          <SocketContainer.Provider>
            <AuthContainer.Provider>
              <PermissionsContainer.Provider>
                {children}
              </PermissionsContainer.Provider>
            </AuthContainer.Provider>
          </SocketContainer.Provider>
        </DebugContainer.Provider>
      </ServerConfigContainer.Provider>
    </HashRouter>
  )
}
