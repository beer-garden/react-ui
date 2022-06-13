import JobCreateApp from 'apps/job_create_app'
import { RequireAuth } from 'components/Routes'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { CommandIndex } from 'pages/CommandIndex'
import { CommandView } from 'pages/CommandView'
import { GardensAdmin } from 'pages/GardenAdmin'
import { GardenAdminView } from 'pages/GardenAdminView'
import { JobIndex } from 'pages/JobIndex'
import { JobView } from 'pages/JobView'
import { Login } from 'pages/Login'
import { RequestsIndex } from 'pages/RequestsIndex'
import { RequestView } from 'pages/RequestView'
import { SystemAdmin } from 'pages/SystemAdmin'
import { SystemsIndex } from 'pages/SystemIndex'
import { useEffect, useState } from 'react'
import {
  Navigate,
  Route,
  Routes as ReactRouterDomRoutes,
} from 'react-router-dom'

const Routes = () => {
  const { getConfig } = ServerConfigContainer.useContainer()
  const [authIsEnabled, setAuthIsEnabled] = useState<boolean | undefined>()

  useEffect(() => {
    const fetchData = async () => {
      const data = await getConfig()

      setAuthIsEnabled(data?.auth_enabled)
    }

    fetchData()
  }, [])

  if (authIsEnabled === undefined) return null

  return (
    <ReactRouterDomRoutes>
      <Route path={'systems'} element={<RequireAuth />}>
        <Route index element={<SystemsIndex />} />

        <Route path={':namespace'}>
          <Route index element={<CommandIndex />} />

          <Route path={':system_name'}>
            <Route index element={<CommandIndex />} />

            <Route path={':version'}>
              <Route index element={<CommandIndex />} />
              <Route
                path={'commands/:command_name'}
                element={<CommandView />}
              />
            </Route>
          </Route>
        </Route>
      </Route>

      <Route path="admin" element={<RequireAuth />}>
        <Route path="systems" element={<SystemAdmin />} />
        <Route path="gardens">
          <Route index element={<GardensAdmin />} />
          <Route path={':gardenName'} element={<GardenAdminView />} />
        </Route>
      </Route>

      <Route path={'requests'} element={<RequireAuth />}>
        <Route index element={<RequestsIndex />} />
        <Route path={':id'} element={<RequestView />} />
      </Route>

      <Route path={'jobs'} element={<RequireAuth />}>
        <Route index element={<JobIndex />} />
        <Route path={'create'} element={<JobCreateApp />} />
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
