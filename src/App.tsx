import { CircularProgress } from '@mui/material'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import ErrorBoundary from 'components/ErrorBoundary'
import { JobRequestCreationProvider } from 'components/JobRequestCreation'
import { Routes } from 'components/Routes'
import Layout from 'components/UI/Layout'
import { Settings } from 'luxon'
import { Suspense } from 'react'

Settings.defaultZone = 'UTC'

const App = (): JSX.Element => {
  return (
    <JobRequestCreationProvider>
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <Layout>
          <ErrorBoundary>
            <Suspense fallback={<CircularProgress size={25} color="inherit" />}>
              <Routes />
            </Suspense>
          </ErrorBoundary>
        </Layout>
      </LocalizationProvider>
    </JobRequestCreationProvider>
  )
}

export default App
