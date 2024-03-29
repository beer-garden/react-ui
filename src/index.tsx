import './index.css'

import { CssBaseline } from '@mui/material'
import { ThemeProvider } from 'components/UI/Theme/ThemeProvider'
import { AuthContainer } from 'containers/AuthContainer'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { DebugContainer } from 'containers/DebugContainer'
import { PermissionsContainer } from 'containers/PermissionsContainer'
import { SocketContainer } from 'containers/SocketContainer'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'

import App from './App'
import reportWebVitals from './reportWebVitals'

ReactDOM.render(
  <HashRouter>
    <ThemeProvider>
      <CssBaseline />
      <ServerConfigContainer.Provider>
        <DebugContainer.Provider>
          <SocketContainer.Provider>
            <AuthContainer.Provider>
              <PermissionsContainer.Provider>
                <App />
              </PermissionsContainer.Provider>
            </AuthContainer.Provider>
          </SocketContainer.Provider>
        </DebugContainer.Provider>
      </ServerConfigContainer.Provider>
    </ThemeProvider>
  </HashRouter>,
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
