import { render, waitFor } from '@testing-library/react'
import { AuthContainer } from 'containers/AuthContainer'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { DebugContainer } from 'containers/DebugContainer'
import { BrowserRouter } from 'react-router-dom'

import App from './App'

describe('App', () => {
  test('main app renders', async () => {
    const { container } = render(
      <BrowserRouter>
        <ServerConfigContainer.Provider>
          <DebugContainer.Provider>
            <AuthContainer.Provider>
              <App />
            </AuthContainer.Provider>
          </DebugContainer.Provider>
        </ServerConfigContainer.Provider>
      </BrowserRouter>,
    )
    // await waitFor fixes 'code that causes React state updates should be wrapped into act(...):' error
    await waitFor(() => expect(container).toContainHTML('<header'))
    // TODO: this currently fails for unknown reasons
  })
})
