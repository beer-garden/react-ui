import { RequireAuth } from 'components/Routes'
import { ServerConfigContainer } from 'containers/ConfigContainer'
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
const GardensAdmin = lazy(() => import('pages/GardenAdmin'))
const GardenAdminView = lazy(() => import('pages/GardenAdminView'))
const JobCreate = lazy(() => import('pages/JobCreate'))
const JobIndex = lazy(() => import('pages/JobIndex'))
const JobView = lazy(() => import('pages/JobView'))
const RequestsIndex = lazy(() => import('pages/RequestsIndex'))
const RequestView = lazy(() => import('pages/RequestView'))
const SystemAdmin = lazy(() => import('pages/SystemAdmin'))
const SystemsIndex = lazy(() => import('pages/SystemIndex'))
const UsersIndex = lazy(() => import('pages/UsersIndex'))

const Routes = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()

  if (authEnabled === undefined) return null

  return (
    <ReactRouterDomRoutes>
      <Route path={'systems'} element={<RequireAuth />}>
        <Route index element={<SystemsIndex />} />
        <Route path={':namespace'}>
          <Route index element={<CommandIndex />} />
          <Route path={':systemName'}>
            <Route index element={<CommandIndex />} />
            <Route path={':version'}>
              <Route index element={<CommandIndex />} />
              <Route path={'commands/:commandName'} element={<CommandView />} />
            </Route>
          </Route>
        </Route>
      </Route>
      <Route path="admin" element={<RequireAuth />}>
        {authEnabled && <Route path="users" element={<UsersIndex />} />}
        <Route path="systems" element={<SystemAdmin />} />
        <Route path="gardens">
          <Route index element={<GardensAdmin />} />
          <Route path={':gardenName'} element={<GardenAdminView />} />
        </Route>
        <Route path="commandblocklist" element={<CommandBlocklistView />} />
      </Route>
      <Route path={'requests'} element={<RequireAuth />}>
        <Route index element={<RequestsIndex />} />
        <Route path={':id'} element={<RequestView />} />
      </Route>
      <Route path={'jobs'} element={<RequireAuth />}>
        <Route index element={<JobIndex />} />
        <Route path={'create'} element={<JobCreate />} />
        <Route path={':id'} element={<JobView />} />
      </Route>
      <Route path={'/login'} element={<Login />} />
      <Route
        path={'*'}
        element={
          <RequireAuth>
            <Navigate replace to={'/systems'} />
          </RequireAuth>
        }
      />
    </ReactRouterDomRoutes>
  )
}

export { Routes }
