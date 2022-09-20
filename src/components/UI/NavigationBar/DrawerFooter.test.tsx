import { render, screen, waitFor } from '@testing-library/react'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { BrowserRouter } from 'react-router-dom'
import { TServerConfig, TVersionConfig } from 'test/test-values'

import { DrawerFooter } from './DrawerFooter'

describe('DrawerFooter', () => {
  test('render BG version', async () => {
    const { container } = render(
      <BrowserRouter>
        <ServerConfigContainer.Provider>
          <DrawerFooter />
        </ServerConfigContainer.Provider>
      </BrowserRouter>,
    )
    await waitFor(() => {
      expect(container).toContainHTML(
        `Beer Garden <b>${TVersionConfig.beer_garden_version}</b>`,
      )
    })
  })

  test('render clickable API link', async () => {
    render(
      <BrowserRouter>
        <ServerConfigContainer.Provider>
          <DrawerFooter />
        </ServerConfigContainer.Provider>
      </BrowserRouter>,
    )
    expect(screen.getByText('OpenAPI Documentation')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByTestId('apiLink')).toHaveAttribute(
        'href',
        `${TServerConfig.url_prefix}swagger/index.html?config=${TServerConfig.url_prefix}config/swagger`,
      )
    })
  })
})
