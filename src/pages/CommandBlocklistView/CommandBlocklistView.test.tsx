import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { mockAxios } from 'test/axios-mock'
import { TBlockedCommand, TBlocklist } from 'test/system-test-values'
import { AllProviders } from 'test/testMocks'

import { CommandBlocklistView } from './CommandBlocklistView'

describe('CommandBlocklistView', () => {
  test('render table of blocked commands', async () => {
    render(
      <AllProviders>
        <CommandBlocklistView />
      </AllProviders>,
    )
    expect(screen.getByText('Command Publishing Blocklist')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText(TBlockedCommand.command)).toBeInTheDocument()
    })
  })

  test('render button to add command', async () => {
    render(
      <AllProviders>
        <CommandBlocklistView />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Add command' }),
      ).toBeInTheDocument()
    })
  })

  test('add modal submits', async () => {
    render(
      <AllProviders>
        <CommandBlocklistView />
      </AllProviders>,
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
      <AllProviders>
        <CommandBlocklistView />
      </AllProviders>,
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
      <AllProviders>
        <CommandBlocklistView />
      </AllProviders>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Add command' }))
    fireEvent.click(screen.getByRole('checkbox'))
    mockAxios.onGet('/api/v1/commandpublishingblocklist').reply(200, {
      command_publishing_blocklist: [
        TBlockedCommand,
        Object.assign({}, TBlockedCommand, { command: 'newBlockedCommand' }),
      ],
    })
    fireEvent.click(screen.getByText('Submit'))
    await waitFor(() => {
      expect(screen.getByText('newBlockedCommand')).toBeInTheDocument()
    })
    mockAxios.onGet('/api/v1/commandpublishingblocklist').reply(200, TBlocklist)
  })
})
