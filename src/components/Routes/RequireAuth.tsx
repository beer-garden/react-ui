import { ReactElement } from 'react'
import { Navigate, useLocation } from 'react-router'
import { AuthContainer } from '../../containers/AuthContainer'
import { useIsAuthEnabled } from '../../hooks/useIsAuthEnabled'

interface RequireAuthProps {
  children: ReactElement
  redirectTo?: string
}

const RequireAuth = ({ children, redirectTo = '/login' }: RequireAuthProps) => {
  const { authIsEnabled } = useIsAuthEnabled()
  const { isAuthenticated, user } = AuthContainer.useContainer()
  const { pathname } = useLocation()

  if (authIsEnabled) {
    console.log('RequireAuth IS AUTHENTICATED: ', isAuthenticated())
    console.log('RequireAuth USER: ', user ?? 'No User')

    return isAuthenticated() ? (
      children
    ) : (
      <Navigate to={redirectTo} state={{ from: pathname }} />
    )
  } else {
    return children
  }
}

export default RequireAuth
