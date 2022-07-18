import { LocalizationProvider } from '@mui/lab'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { Routes } from 'components/Routes'
import Layout from 'components/UI/Layout'
import moment from 'moment-timezone'

moment.tz.setDefault('UTC')

const App = (): JSX.Element => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Layout>
        <Routes />
      </Layout>
    </LocalizationProvider>
  )
}

export default App
