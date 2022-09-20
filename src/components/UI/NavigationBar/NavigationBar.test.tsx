import { render, screen } from '@testing-library/react'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { DebugContainer } from 'containers/DebugContainer'
import { BrowserRouter } from 'react-router-dom'

import { NavigationBar } from './NavigationBar'

describe('NavigationBar', () => {
  test('renders title bar', async () => {
    render(
      <BrowserRouter>
        <ServerConfigContainer.Provider>
          <DebugContainer.Provider>
            <NavigationBar
              setMarginLeft={() => {
                console.log('set margin')
              }}
            />
          </DebugContainer.Provider>
        </ServerConfigContainer.Provider>
      </BrowserRouter>,
    )
    // alternate fix to 'code that causes React state updates should be wrapped into act(...):' error
    const header = await screen.findByRole('heading')
    expect(header).toBeInTheDocument()
    expect(header.textContent).toEqual('Beer Garden')
  })
})
