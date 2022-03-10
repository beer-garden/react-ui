import {
  Navigate,
  Route,
  Routes as ReactRouterDomRoutes,
} from 'react-router-dom'
import CommandIndex from '../../pages/CommandIndex/CommandIndex'
import CommandView from '../../pages/CommandView/CommandView'
import GardensAdmin from '../../pages/GardenAdmin/GardenAdmin'
import JobIndex from '../../pages/JobIndex/JobIndex'
import JobView from '../../pages/JobView/JobView'
import JobCreateApp from '../../apps/job_create_app'
import RequestsIndex from '../../pages/RequestsIndex/RequestsIndex'
import RequestView from '../../pages/RequestView/RequestView'
import SystemAdmin from '../../pages/SystemAdmin/SystemAdmin'
import SystemsIndex from '../../pages/SystemIndex/SystemIndex'
import Login from '../../pages/Login'
import GardenAdminView from '../../pages/GardenAdminView/GardenAdminView'
import RequireAuth from './RequireAuth'

const Routes = () => {
  return (
    <ReactRouterDomRoutes>
      <Route
        path={
          '/systems/:namespace/:system_name/:version/commands/:command_name/'
        }
        element={
          <RequireAuth>
            <CommandView />
          </RequireAuth>
        }
      />
      <Route
        path={'/systems/:namespace/:system_name/:version/'}
        element={
          <RequireAuth>
            <CommandIndex />
          </RequireAuth>
        }
      />
      <Route
        path={'/systems/:namespace/:system_name/'}
        element={
          <RequireAuth>
            <CommandIndex />
          </RequireAuth>
        }
      />
      <Route
        path={'/systems/:namespace/'}
        element={
          <RequireAuth>
            <CommandIndex />
          </RequireAuth>
        }
      />
      <Route path={'/systems'} element={<SystemsIndex />} />
      <Route
        path="/admin/systems"
        element={
          <RequireAuth>
            <SystemAdmin />
          </RequireAuth>
        }
      />
      <Route
        path={'/admin/gardens/:gardenName/'}
        element={
          <RequireAuth>
            <GardenAdminView />
          </RequireAuth>
        }
      />
      <Route
        path={'/admin/gardens'}
        element={
          <RequireAuth>
            <GardensAdmin />
          </RequireAuth>
        }
      />
      <Route
        path={'/requests/:id'}
        element={
          <RequireAuth>
            <RequestView />
          </RequireAuth>
        }
      />
      <Route
        path={'/requests'}
        element={
          <RequireAuth>
            <RequestsIndex />
          </RequireAuth>
        }
      />
      <Route
        path={'/jobs/create'}
        element={
          <RequireAuth>
            <JobCreateApp location={{}} />
          </RequireAuth>
        }
      />
      <Route
        path={'/jobs/:id'}
        element={
          <RequireAuth>
            <JobView />
          </RequireAuth>
        }
      />
      <Route
        path={'/jobs'}
        element={
          <RequireAuth>
            <JobIndex />
          </RequireAuth>
        }
      />
      <Route path={'/login'} element={<Login />} />
      <Route path={'*'} element={<Navigate replace to={'/systems'} />} />
    </ReactRouterDomRoutes>
  )
}

export default Routes
