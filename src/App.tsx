import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { JobRequestCreationProvider } from 'components/JobRequestCreation'
import { Routes } from 'components/Routes'
import Layout from 'components/UI/Layout'
import { Settings } from 'luxon'

Settings.defaultZone = 'UTC'

const App = (): JSX.Element => {
  return (
    <JobRequestCreationProvider>
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <Layout>
          <Routes />
        </Layout>
      </LocalizationProvider>
    </JobRequestCreationProvider>
  )
}

export default App
