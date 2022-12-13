import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { TChildRequest, TRequest } from 'test/test-values'
import { AllProviders } from 'test/testMocks'
import { dateFormatted } from 'utils/date-formatter'

import { RequestViewTable } from './RequestViewTable'

describe('RequestViewTable', () => {
  test('renders request data', async () => {
    render(
      <AllProviders>
        <RequestViewTable request={TRequest} />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText('Command:')).toBeInTheDocument()
    })
    expect(screen.getByText(TRequest.command)).toBeInTheDocument()
    expect(screen.getByText('Namespace:')).toBeInTheDocument()
    expect(screen.getByText(TRequest.namespace)).toBeInTheDocument()
    expect(screen.getByText('System:')).toBeInTheDocument()
    expect(screen.getByText(TRequest.system)).toBeInTheDocument()
    expect(screen.getByText('Version:')).toBeInTheDocument()
    expect(screen.getByText(TRequest.system_version)).toBeInTheDocument()
    expect(screen.getByText('Instance:')).toBeInTheDocument()
    expect(screen.getByText(TRequest.instance_name)).toBeInTheDocument()
    expect(screen.getByText('Status:')).toBeInTheDocument()
    expect(screen.getByText('SUCCESS')).toBeInTheDocument()
    expect(screen.getByText('Created:')).toBeInTheDocument()
    expect(screen.getByText('Nov 3, 2022, 23:12:46 UTC')).toBeInTheDocument()
    expect(screen.getByText('Updated:')).toBeInTheDocument()
    expect(screen.getByText('Nov 3, 2022, 23:14:14 UTC')).toBeInTheDocument()
  })

  test('renders links for some data data', async () => {
    render(
      <AllProviders>
        <RequestViewTable request={TRequest} />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(
        screen.getByRole('link', { name: TRequest.command }),
      ).toBeInTheDocument()
    })
    expect(
      screen.getByRole('link', { name: TRequest.namespace }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: TRequest.system }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: TRequest.system_version }),
    ).toBeInTheDocument()
  })

  test('does not render child data if no child', async () => {
    render(
      <AllProviders>
        <RequestViewTable request={TRequest} />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText('Command:')).toBeInTheDocument()
    })
    expect(
      screen.queryByRole('heading', { name: 'Children' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Children' }),
    ).not.toBeInTheDocument()
  })

  describe('request with child', () => {
    test('renders child section', async () => {
      const reqWithChild = Object.assign({}, TRequest, {
        children: [TChildRequest],
      })
      render(
        <AllProviders>
          <RequestViewTable request={reqWithChild} />
        </AllProviders>,
      )
      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Children' }),
        ).toBeInTheDocument()
      })
      expect(
        screen.getByRole('button', { name: 'Children' }),
      ).toBeInTheDocument()
      expect(screen.queryByRole('table')).not.toBeInTheDocument()
    })

    test('opens child data', async () => {
      const reqWithChild = Object.assign({}, TRequest, {
        children: [TChildRequest],
      })
      render(
        <AllProviders>
          <RequestViewTable request={reqWithChild} />
        </AllProviders>,
      )
      await waitFor(() => {
        screen.getByRole('button', { name: 'Children' })
      })
      fireEvent.click(screen.getByRole('button', { name: 'Children' }))
      expect(screen.getByRole('table')).toBeInTheDocument()
      expect(screen.getByText(TChildRequest.command)).toBeInTheDocument()
      expect(screen.getByText(TChildRequest.namespace)).toBeInTheDocument()
      expect(screen.getByText(TChildRequest.system)).toBeInTheDocument()
      expect(screen.getByText(TChildRequest.system_version)).toBeInTheDocument()
      expect(screen.getByText(TChildRequest.instance_name)).toBeInTheDocument()
      expect(screen.getByText(TChildRequest.status)).toBeInTheDocument()
      expect(
        screen.getByText(dateFormatted(new Date(TChildRequest.created_at))),
      ).toBeInTheDocument()
    })
  })
})
