import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { mockAxios } from 'test/axios-mock'
import { TGarden } from 'test/garden-test-values'
import { AllProviders } from 'test/testMocks'

import SyncUserModal from './SyncUserModal'

describe('SyncUser Modal', () => {
  test('renders modal window with contents', async () => {
    render(
      <AllProviders>
        <SyncUserModal open={true} setOpen={jest.fn()} />
      </AllProviders>,
    )
    // await first one to let axios give back queue list
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument()
    })
    expect(
      screen.getByRole('heading', { name: 'Sync Users' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('columnheader', { name: 'Garden' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('columnheader', { name: 'Sync Status' }),
    ).toBeInTheDocument()
  })

  test('allows sync users', async () => {
    render(
      <AllProviders>
        <SyncUserModal open={true} setOpen={jest.fn()} />
      </AllProviders>,
    )
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    await waitFor(() => {
      expect(
        screen.getByText('SUCCESS: Users successfully synced!'),
      ).toBeInTheDocument()
    })
  })

  test('alerts on failure to get gardens', async () => {
    mockAxios
      .onGet('/api/v1/gardens')
      .reply(404, { message: 'Failure to return gardens' })
    render(
      <AllProviders>
        <SyncUserModal open={true} setOpen={jest.fn()} />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(
        screen.getByText('ERROR: Error: Request failed with status code 404'),
      ).toBeInTheDocument()
    })
    mockAxios.onGet('/api/v1/gardens').reply(200, [TGarden])
  })

  test('alerts on failure to get sync users', async () => {
    mockAxios
      .onPatch('/api/v1/gardens')
      .reply(404, { message: 'Failure to sync users' })
    render(
      <AllProviders>
        <SyncUserModal open={true} setOpen={jest.fn()} />
      </AllProviders>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    await waitFor(() => {
      expect(
        screen.getByText('ERROR: Error: Request failed with status code 404'),
      ).toBeInTheDocument()
    })
  })

  test('allows cancel', async () => {
    render(
      <AllProviders>
        <SyncUserModal open={true} setOpen={jest.fn()} />
      </AllProviders>,
    )
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    await waitFor(() => {
      expect(
        screen.queryByText('SUCCESS: Users successfully synced!'),
      ).not.toBeInTheDocument()
    })
  })
})
