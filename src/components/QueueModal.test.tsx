import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { TInstance, TQueue } from 'test/test-values'
import { AllProviders } from 'test/testMocks'

import QueueModal from './QueueModal'

describe('Queue Modal', () => {
  test('renders modal window with contents', async () => {
    render(
      <AllProviders>
        <QueueModal instance={TInstance} />
      </AllProviders>,
    )
    // await first one to let axios give back queue list
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument()
    })
    expect(screen.getByRole('heading')).toBeInTheDocument()
    expect(
      screen.getByRole('columnheader', { name: 'Name' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('columnheader', { name: 'Message Size' }),
    ).toBeInTheDocument()
  })

  test('makes user confirm to clear queue', async () => {
    render(
      <AllProviders>
        <QueueModal instance={TInstance} />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument()
    })
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
    expect(screen.getByText(`Clear ${TQueue.name} Queue?`)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    await waitFor(() => {
      expect(
        screen.queryByText(`Clear ${TQueue.name} Queue?`),
      ).not.toBeInTheDocument()
    })
  })

  test('alerts on failure', async () => {
    const badInst = Object.assign({}, TInstance)
    badInst.id = 'bad'
    render(
      <AllProviders>
        <QueueModal instance={badInst} />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
    expect(
      screen.getByText('Error fetching Queue list: Failure to return queue'),
    ).toBeInTheDocument()
  })
})
