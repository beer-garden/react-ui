import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { DebugContainer } from 'containers/DebugContainer'
import { BrowserRouter } from 'react-router-dom'
import { TInstance, TQueue } from 'test/testData'

import QueueModal from './QueueModal'

describe('Queue Modal', () => {
  test('renders modal window with contents', async () => {
    render(
      <BrowserRouter>
        <ServerConfigContainer.Provider>
          <DebugContainer.Provider>
            <QueueModal instance={TInstance} />
          </DebugContainer.Provider>
        </ServerConfigContainer.Provider>
      </BrowserRouter>,
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
      <BrowserRouter>
        <ServerConfigContainer.Provider>
          <DebugContainer.Provider>
            <QueueModal instance={TInstance} />
          </DebugContainer.Provider>
        </ServerConfigContainer.Provider>
      </BrowserRouter>,
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
      <BrowserRouter>
        <ServerConfigContainer.Provider>
          <DebugContainer.Provider>
            <QueueModal instance={badInst} />
          </DebugContainer.Provider>
        </ServerConfigContainer.Provider>
      </BrowserRouter>,
    )
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
    expect(
      screen.getByText('Error fetching Queue list: Failure to return queue'),
    ).toBeInTheDocument()
  })
})
