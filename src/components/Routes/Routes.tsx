import { FC } from 'react'
import { Navigate, Route, Routes as RRDRoutes } from 'react-router-dom'
import CommandsApp from '../../apps/command_index_app'
import CommandViewApp from '../../apps/command_view_app'
import GardensAdminApp from '../../apps/garden_admin_app'
import JobCreateApp from '../../apps/job_create_app'
import JobsApp from '../../apps/job_index_app'
import JobViewApp from '../../apps/job_view_app'
import RequestApp from '../../apps/request_index_app'
import RequestViewApp from '../../apps/request_view_app'
import SystemsAdminApp from '../../apps/system_admin_app'
import SystemsApp from '../../apps/system_index_app'
import GardenViewApp from '../../components/GardenView/GardenView'
import { System } from '../../custom_types/custom_types'

interface BGRoutesProps {
  systems: System[]
  namespaces: string[]
}
const Routes: FC<BGRoutesProps> = ({ systems, namespaces }) => {
  return (
    <RRDRoutes>
      <Route
        path={
          '/systems/:namespace/:system_name/:version/commands/:command_name/'
        }
        element={<CommandViewApp systems={systems} />}
      ></Route>
      <Route
        path={'/systems/:namespace/:system_name/:version/'}
        element={<CommandsApp systems={systems} />}
      ></Route>
      <Route
        path={'/systems/:namespace/:system_name/'}
        element={<CommandsApp systems={systems} />}
      />
      <Route
        path={'/systems/:namespace/'}
        element={<CommandsApp systems={systems} />}
      />
      <Route path={'/systems'} element={<SystemsApp systems={systems} />} />
      <Route
        path="/admin/systems"
        element={<SystemsAdminApp namespaces={namespaces} systems={systems} />}
      />
      <Route
        path={'/admin/gardens/:garden_name/'}
        element={<GardenViewApp />}
      />
      <Route path={'/admin/gardens'} element={<GardensAdminApp />} />
      <Route path={'/requests/:id'} element={<RequestViewApp />} />
      <Route path={'/requests'} element={<RequestApp />} />
      <Route path={'/jobs/create'} element={<JobCreateApp location={{}} />} />
      <Route path={'/jobs/:id'} element={<JobViewApp />} />
      <Route path={'/jobs'} element={<JobsApp />} />
      <Route path={'*'} element={<Navigate to={'systems'} replace />} />
    </RRDRoutes>
  )
}

export default Routes
