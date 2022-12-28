import { CircularProgress } from '@mui/material'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import ErrorBoundary from 'components/ErrorBoundary'
import { JobRequestCreationProvider } from 'components/JobRequestCreation'
import { Routes } from 'components/Routes'
import Layout from 'components/UI/Layout'
import { Settings } from 'luxon'
import { Suspense } from 'react'
import React from 'react'
// import ReactDOM from 'react-dom'

Settings.defaultZone = 'UTC'

const App = (): JSX.Element => {
  // Uncomment to view Section 508 linting in DevTools
  // if (process.env.NODE_ENV !== 'production') {
  //   // eslint-disable-next-line @typescript-eslint/no-var-requires
  //   const axe = require('@axe-core/react')
  //   axe(React, ReactDOM, 1000, {
  //     runOnly: {
  //       type: 'tag',
  //       values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
  //     },
  //   })
  // }

  return (
    <JobRequestCreationProvider>
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <Layout>
          <ErrorBoundary>
            <Suspense
              fallback={
                <CircularProgress
                  aria-label="Loading Beer Garden"
                  size={25}
                  color="inherit"
                />
              }
            >
              <Routes />
            </Suspense>
          </ErrorBoundary>
        </Layout>
      </LocalizationProvider>
    </JobRequestCreationProvider>
  )
}

export default App
