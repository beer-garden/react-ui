import { render, screen, waitFor } from '@testing-library/react'
import { UnassociatedRunnersCard } from 'pages/SystemAdmin/UnassociatedRunners'
import { mockAxios } from 'test/axios-mock'
import { TRunner, TRunner2 } from 'test/system-test-values'
import { AllProviders } from 'test/testMocks'

describe('UnassociatedRunnersCard', () => {
  test('receives data with unassociated runners', async () => {
    mockAxios.onGet('/api/vbeta/runners').reply(200, [TRunner, TRunner2])
    render(
      <AllProviders>
        <UnassociatedRunnersCard />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText('Unassociated Local Runners')).toBeInTheDocument()
    })
    expect(screen.getByText(TRunner2.path)).toBeInTheDocument()
    expect(screen.getByText(TRunner2.id)).toBeInTheDocument()
    expect(screen.queryByText(TRunner.path)).not.toBeInTheDocument()
  })

  test('receives data without unassociated runners', async () => {
    mockAxios.onGet('/api/vbeta/runners').reply(200, [TRunner])
    render(
      <AllProviders>
        <UnassociatedRunnersCard />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(
        screen.queryByText('Unassociated Local Runners'),
      ).not.toBeInTheDocument()
    })
    expect(screen.queryByText(TRunner.path)).not.toBeInTheDocument()
  })
})
