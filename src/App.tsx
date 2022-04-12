import Routes from './components/Routes/Routes'
import Layout from './components/UI/Layout'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/lab'

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
