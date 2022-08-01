import { render, screen } from '@testing-library/react'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { BrowserRouter } from 'react-router-dom'

import App from './App'

test('renders learn react link', () => {
  const { container } = render(
    <BrowserRouter>
      <ServerConfigContainer.Provider>
        <App />
      </ServerConfigContainer.Provider>
    </BrowserRouter>,
  )
  expect(container).toContainHTML('<header')
})
