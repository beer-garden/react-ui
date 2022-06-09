import { CssBaseline } from '@mui/material'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import ThemeProvider from './components/UI/Theme/ThemeProvider'
import './index.css'
import reportWebVitals from './reportWebVitals'
import { AuthContainer } from './containers/AuthContainer'
import { ServerConfigContainer } from './containers/ConfigContainer'

ReactDOM.render(
  <BrowserRouter>
    <ThemeProvider>
      <CssBaseline />
      <ServerConfigContainer.Provider>
        <AuthContainer.Provider>
          <App />
        </AuthContainer.Provider>
      </ServerConfigContainer.Provider>
    </ThemeProvider>
  </BrowserRouter>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
