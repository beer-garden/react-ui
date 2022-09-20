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
  const { authEnabled } = ServerConfigContainer.useContainer()
  const { pathname } = useLocation()

  if (!authEnabled || (authEnabled && isAuthenticated())) {
    return (
      <>
        {children}
        <Outlet />
      </>
    )
  }

  return <Navigate to={redirectTo} state={{ from: pathname }} />
}

export { RequireAuth }
