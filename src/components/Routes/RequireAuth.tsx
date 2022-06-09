import { ReactElement } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { AuthContainer } from '../../containers/AuthContainer'
import { ServerConfigContainer } from '../../containers/ConfigContainer'

interface RequireAuthProps {
  children?: ReactElement
  redirectTo?: string
}

const RequireAuth = ({ children, redirectTo = '/login' }: RequireAuthProps) => {
  const { isAuthenticated, user } = AuthContainer.useContainer()
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
    console.log('RequireAuth IS AUTHENTICATED: ', isAuthenticated())
    console.log('RequireAuth USER: ', user ?? 'No User')

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

export default RequireAuth
