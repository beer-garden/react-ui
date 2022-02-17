import { Backdrop, Box, CircularProgress } from '@mui/material'
import { AxiosResponse } from 'axios'
import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import CommandsApp from './apps/command_index_app'
import CommandViewApp from './apps/command_view_app'
import GardensAdminApp from './apps/garden_admin_app'
import GardenViewApp from './components/GardenView/GardenView'
import JobCreateApp from './apps/job_create_app'
import JobsApp from './apps/job_index_app'
import JobViewApp from './apps/job_view_app'
import RequestApp from './apps/request_index_app'
import RequestViewApp from './apps/request_view_app'
import SystemsAdminApp from './apps/system_admin_app'
import SystemsApp from './apps/system_index_app'
import Menu from './components/menu'
import { System } from './custom_types/custom_types'
import NamespacesService from './services/namespace_service'
import SystemsService from './services/system_service'

const App = (): JSX.Element => {
  const [systems, setSystems] = useState<System[]>([])
  const [namespaces, setNamespaces] = useState<string[]>([])

  if (!systems[0]) {
    SystemsService.getSystems(successCallback)
    NamespacesService.getNamespaces(successNamespaceCallback)
  }

  function successCallback(response: AxiosResponse) {
    setSystems(response.data)
  }

  function successNamespaceCallback(response: AxiosResponse) {
    setNamespaces(response.data)
  }
  if (systems[0] && namespaces[0]) {
    return (
      <Box>
        <Menu />
        <Box px={2}>
          <Routes>
            <Route
              path="/systems/:namespace/:system_name/:version/commands/:command_name/"
              element={<CommandViewApp systems={systems} />}
            ></Route>
            <Route
              path="/systems/:namespace/:system_name/:version/"
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
            <Route
              path={'/systems'}
              element={<SystemsApp systems={systems} />}
            />
            <Route
              path="/admin/systems"
              element={
                <SystemsAdminApp namespaces={namespaces} systems={systems} />
              }
            />
            <Route
              path="/admin/gardens/:garden_name/"
              element={<GardenViewApp />}
            />
            <Route path="/admin/gardens" element={<GardensAdminApp />} />
            <Route path="/requests/:id" element={<RequestViewApp />} />
            <Route path="/requests" element={<RequestApp />} />
            <Route
              path="/jobs/create"
              element={<JobCreateApp location={{}} />}
            />
            <Route path="/jobs/:id" element={<JobViewApp />} />
            <Route path="/jobs" element={<JobsApp />} />
            <Route path="*" element={<Navigate to="systems" replace />} />
          </Routes>
        </Box>
      </Box>
    )
  } else {
    return (
      <Box>
        <Menu />
        <Backdrop open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Box>
    )
  }
}

export default App
