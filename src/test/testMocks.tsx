import ErrorBoundary from 'components/ErrorBoundary'
import { AuthContainer } from 'containers/AuthContainer'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { DebugContainer } from 'containers/DebugContainer'
import { PermissionsContainer } from 'containers/PermissionsContainer'
import { SocketContainer } from 'containers/SocketContainer'
import { Suspense } from 'react'
import { HashRouter } from 'react-router-dom'

interface AuthContextType {
  isAuthEnabled: boolean
  userName: string
}

interface ProviderMocks {
  children: JSX.Element
  authProps?: AuthContextType
}

/**
 * Wrapper that puts children inside all props needed to render app properly
 * @param param0 Component(s) to render as children
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
 * Wrapper that just has config provider
 * @param param0 Component(s) to render as children
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
 * @param param0 Component(s) to render as children
 * @returns
 */
export const SuspendedProviders = ({ children }: ProviderMocks) => {
  return (
    <HashRouter>
      <ServerConfigContainer.Provider>
        <DebugContainer.Provider>
          <SocketContainer.Provider>
            <AuthContainer.Provider>
              <Suspense fallback={<>LOADING...</>}>{children}</Suspense>
            </AuthContainer.Provider>
          </SocketContainer.Provider>
        </DebugContainer.Provider>
      </ServerConfigContainer.Provider>
    </HashRouter>
  )
}

/**
 * Wrapper that puts children inside all props needed to render app properly
 * AND logs in as admin user
 * @param param0 Component(s) to render as children
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
                <LoginProvider>{children}</LoginProvider>
              </AuthContainer.Provider>
            </SocketContainer.Provider>
          </DebugContainer.Provider>
        </ServerConfigContainer.Provider>
      </ErrorBoundary>
    </HashRouter>
  )
}

const LoginProvider = ({ children }: ProviderMocks) => {
  const { login } = AuthContainer.useContainer()
  login('admin', 'password')
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
 * @param param0
 * @returns
 */
export const SocketProvider = ({ children }: ProviderMocks) => {
  return (
    <DebugContainer.Provider initialState={{ SOCKET: true }}>
      <SocketContainer.Provider>{children}</SocketContainer.Provider>
    </DebugContainer.Provider>
  )
}
