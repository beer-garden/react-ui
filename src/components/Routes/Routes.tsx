import { RequireAuth } from 'components/Routes'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { PermissionsContainer } from 'containers/PermissionsContainer'
import { CommandViewOld } from 'pages/CommandView'
import { Login } from 'pages/Login'
import { lazy } from 'react'
import {
  Navigate,
  Route,
  Routes as ReactRouterDomRoutes,
} from 'react-router-dom'

const CommandBlocklistView = lazy(() => import('pages/CommandBlocklistView'))
const CommandIndex = lazy(() => import('pages/CommandIndex'))
const CommandView = lazy(() => import('pages/CommandView'))
const GardenAdmin = lazy(() => import('pages/GardenAdmin'))
const GardenAdminView = lazy(() => import('pages/GardenAdminView'))
const JobCreate = lazy(() => import('pages/JobCreate'))
const JobIndex = lazy(() => import('pages/JobIndex'))
const JobView = lazy(() => import('pages/JobView'))
const RequestsIndex = lazy(() => import('pages/RequestsIndex'))
const RequestView = lazy(() => import('pages/RequestView'))
const SystemAdmin = lazy(() => import('pages/SystemAdmin'))
const SystemsIndex = lazy(() => import('pages/SystemIndex'))
const UsersIndex = lazy(() => import('pages/UsersIndex'))
const UsersView = lazy(() => import('pages/UsersView'))

const Routes = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()

  const { hasPermission, isPermissionsSet } =
    PermissionsContainer.useContainer()
  if (authEnabled === undefined) return null

  return (
    <ReactRouterDomRoutes>
      <Route path="systems" element={<RequireAuth />}>
        <Route index element={<SystemsIndex />} />
        <Route path=":namespace">
          <Route index element={<CommandIndex />} />
          <Route path=":systemName">
            <Route index element={<CommandIndex />} />
            <Route path=":version">
              <Route index element={<CommandIndex />} />
              <Route path="commands/:commandName" element={<CommandView />} />
            </Route>
          </Route>
        </Route>
      </Route>
      {(hasPermission('system:update') || hasPermission('garden:update')) && (
        <Route path="admin" element={<RequireAuth />}>
          {authEnabled && hasPermission('user:update') && (
            <Route path="users">
              <Route index element={<UsersIndex />} />
              <Route path=":userName" element={<UsersView />} />
            </Route>
          )}
          {hasPermission('system:update') && (
            <Route path="systems" element={<SystemAdmin />} />
          )}
          {hasPermission('garden:update') && (
            <Route path="gardens">
              <Route index element={<GardenAdmin />} />
              <Route path=":gardenName" element={<GardenAdminView />} />
            </Route>
          )}
          {hasPermission('garden:update') && (
            <Route path="commandblocklist" element={<CommandBlocklistView />} />
          )}
        </Route>
      )}
      <Route path="requests" element={<RequireAuth />}>
        <Route index element={<RequestsIndex />} />
        <Route path=":id" element={<RequestView />} />
      </Route>
      {hasPermission('job:read') && (
        <Route path="jobs" element={<RequireAuth />}>
          <Route index element={<JobIndex />} />
          <Route path="create" >
            <Route index element={<JobCreate />} />
              <Route path=":namespace/:systemName/:version/commands/:commandName" element={<CommandViewOld />} />
          </Route>
          <Route path=":id" element={<JobView />} />
        </Route>
      )}
      {authEnabled && <Route path="/login" element={<Login />} />}
      {isPermissionsSet() === authEnabled ? (
        <Route
          path="*"
          element={
            <RequireAuth>
              <Navigate replace to="/systems" />
            </RequireAuth>
          }
        />
      ) : (
        <Route path="*" element={<RequireAuth />} />
      )}
    </ReactRouterDomRoutes>
  )
}

export { Routes }
