import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { JobRequestCreationProvider } from 'components/JobRequestCreation'
import { Routes } from 'components/Routes'
import Layout from 'components/UI/Layout'
import { Settings } from 'luxon'

Settings.defaultZone = 'UTC'

const App = (): JSX.Element => {
  return (
    <JobRequestCreationProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Layout>
          <Routes />
        </Layout>
      </LocalizationProvider>
    </JobRequestCreationProvider>
  )
}

export default App
