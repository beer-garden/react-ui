import { AuthContainer } from 'containers/AuthContainer'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { ReactElement } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

interface RequireAuthProps {
  children?: ReactElement
  redirectTo?: string
}

const RequireAuth = ({ children, redirectTo = '/login' }: RequireAuthProps) => {
  const { isAuthenticated } = AuthContainer.useContainer()
  const { config } = ServerConfigContainer.useContainer()
  const { pathname } = useLocation()
  const authIsEnabled = config?.auth_enabled

  if (authIsEnabled === false) {
    return (
      <>
        {children}
        <Outlet />
      </>
    )
  } else if (authIsEnabled === true) {
    return isAuthenticated() ? (
      <>
        {children}
        <Outlet />
      </>
    ) : (
      <Navigate to={redirectTo} state={{ from: pathname }} />
    )
  }
  return null
}

export { RequireAuth }
