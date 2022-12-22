import { render, screen, waitFor } from '@testing-library/react'
import { mockAxios } from 'test/axios-mock'
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

  test('Alert is shown on error from getVersion()', async () => {
    const errorMessage = 'Failure to return version'
    mockAxios.onGet('/version').reply(404, { message: errorMessage })
    render(
      <AllProviders>
        <DrawerFooter />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText(`ERROR: ${errorMessage}`)).toBeInTheDocument()
    })
    mockAxios.onGet('/version').reply(200, TVersionConfig)
  })
})
