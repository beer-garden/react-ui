import { Backdrop, CircularProgress } from '@mui/material'
import { AxiosResponse } from 'axios'
import { useState } from 'react'
import Routes from './components/Routes/Routes'
import Layout from './components/UI/Layout'
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

  function successCallback (response: AxiosResponse) {
    setSystems(response.data)
  }

  function successNamespaceCallback (response: AxiosResponse) {
    setNamespaces(response.data)
  }
  if (systems[0] && namespaces[0]) {
    return (
      <Layout>
        <Routes systems={systems} namespaces={namespaces} />
      </Layout>
    )
  } else {
    return (
      <Layout>
        <Backdrop open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Layout>
    )
  }
}

export default App
