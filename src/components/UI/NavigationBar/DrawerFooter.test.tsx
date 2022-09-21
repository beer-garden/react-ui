import { render, screen, waitFor } from '@testing-library/react'
import { TServerConfig, TVersionConfig } from 'test/test-values'
import { AllProviders } from 'test/testMocks'

import { DrawerFooter } from './DrawerFooter'

describe('DrawerFooter', () => {
  test('render BG version', async () => {
    const { container } = render(
      <AllProviders>
        <DrawerFooter />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(container).toContainHTML(
        `Beer Garden <b>${TVersionConfig.beer_garden_version}</b>`,
      )
    })
  })

  test('render clickable API link', async () => {
    render(
      <AllProviders>
        <DrawerFooter />
      </AllProviders>,
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
