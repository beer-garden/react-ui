import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { DebugContainer } from 'containers/DebugContainer'
import { BrowserRouter } from 'react-router-dom'
import { TBlockedCommand, TCommand } from 'test/testData'

import { CommandBlocklistView } from './CommandBlocklistView'

describe('CommandBlocklistView', () => {
  test('render table of blocked commands', async () => {
    render(
      <BrowserRouter>
        <ServerConfigContainer.Provider>
          <DebugContainer.Provider>
            <CommandBlocklistView />
          </DebugContainer.Provider>
        </ServerConfigContainer.Provider>
      </BrowserRouter>,
    )
    expect(screen.getByText('Command Publishing Blocklist')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText(TBlockedCommand.command)).toBeInTheDocument()
    })
  })

  test('render button to add command', () => {
    render(
      <BrowserRouter>
        <ServerConfigContainer.Provider>
          <DebugContainer.Provider>
            <CommandBlocklistView />
          </DebugContainer.Provider>
        </ServerConfigContainer.Provider>
      </BrowserRouter>,
    )
    expect(
      screen.getByRole('button', { name: 'Add command' }),
    ).toBeInTheDocument()
  })

  test('add modal submits', async () => {
    render(
      <BrowserRouter>
        <ServerConfigContainer.Provider>
          <DebugContainer.Provider>
            <CommandBlocklistView />
          </DebugContainer.Provider>
        </ServerConfigContainer.Provider>
      </BrowserRouter>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Add command' }))
    await waitFor(() => {
      expect(screen.getByText('Submit')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText('Submit'))
    await waitFor(() => {
      expect(screen.queryByText('Submit')).not.toBeInTheDocument()
    })
  })

  test('add modal cancels', async () => {
    render(
      <BrowserRouter>
        <ServerConfigContainer.Provider>
          <DebugContainer.Provider>
            <CommandBlocklistView />
          </DebugContainer.Provider>
        </ServerConfigContainer.Provider>
      </BrowserRouter>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Add command' }))
    await waitFor(() => {
      expect(screen.getByText('Cancel')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText('Cancel'))
    await waitFor(() => {
      expect(screen.queryByText('Cancel')).not.toBeInTheDocument()
    })
  })

  test('adds command to blocklist', async () => {
    render(
      <BrowserRouter>
        <ServerConfigContainer.Provider>
          <DebugContainer.Provider>
            <CommandBlocklistView />
          </DebugContainer.Provider>
        </ServerConfigContainer.Provider>
      </BrowserRouter>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Add command' }))
    fireEvent.click(
      screen.getByRole('checkbox', { name: 'Toggle Row Selected' }),
    )
    fireEvent.click(screen.getByText('Submit'))
    await waitFor(() => {
      expect(screen.getByText(TCommand.name)).toBeInTheDocument()
    })
  })
})
