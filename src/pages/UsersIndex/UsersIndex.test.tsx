import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { DebugContainer } from 'containers/DebugContainer'
import { BrowserRouter } from 'react-router-dom'
import { TUser } from 'test/user-test-values'

import { UsersIndex } from './UsersIndex'

describe('UsersIndex', () => {
  test('render table of current users', async () => {
    render(
      <BrowserRouter>
        <ServerConfigContainer.Provider>
          <DebugContainer.Provider>
            <UsersIndex />
          </DebugContainer.Provider>
        </ServerConfigContainer.Provider>
      </BrowserRouter>,
    )
    expect(screen.getByText('User Management')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText(TUser.username)).toBeInTheDocument()
    })
  })

  test('render button to add user', async () => {
    render(
      <BrowserRouter>
        <ServerConfigContainer.Provider>
          <DebugContainer.Provider>
            <UsersIndex />
          </DebugContainer.Provider>
        </ServerConfigContainer.Provider>
      </BrowserRouter>,
    )
    const btn = await screen.findByRole('button', { name: 'Add user' })
    expect(btn).toBeInTheDocument()
  })

  test.skip('add modal submits', async () => {
    render(
      <BrowserRouter>
        <ServerConfigContainer.Provider>
          <DebugContainer.Provider>
            <UsersIndex />
          </DebugContainer.Provider>
        </ServerConfigContainer.Provider>
      </BrowserRouter>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Add user' }))
    await waitFor(() => {
      expect(screen.getByText('Submit')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText('Submit'))
    await waitFor(() => {
      expect(screen.queryByText('Submit')).not.toBeInTheDocument()
    })
  })

  test.skip('add modal cancels', async () => {
    render(
      <BrowserRouter>
        <ServerConfigContainer.Provider>
          <DebugContainer.Provider>
            <UsersIndex />
          </DebugContainer.Provider>
        </ServerConfigContainer.Provider>
      </BrowserRouter>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Add user' }))
    await waitFor(() => {
      expect(screen.getByText('Cancel')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText('Cancel'))
    await waitFor(() => {
      expect(screen.queryByText('Cancel')).not.toBeInTheDocument()
    })
  })

  test.skip('adds user to table', async () => {
    render(
      <BrowserRouter>
        <ServerConfigContainer.Provider>
          <DebugContainer.Provider>
            <UsersIndex />
          </DebugContainer.Provider>
        </ServerConfigContainer.Provider>
      </BrowserRouter>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Add user' }))
    fireEvent.change(screen.getByRole('input', { name: 'username' }), {
      target: { value: 'testUser' },
    })
    fireEvent.change(screen.getByRole('input', { name: 'password' }), {
      target: { value: 'notSecret' },
    })
    fireEvent.change(screen.getByRole('input', { name: 'confirm' }), {
      target: { value: 'notSecret' },
    })
    fireEvent.click(screen.getByText('Submit'))
    await waitFor(() => {
      expect(screen.getByText('testUser')).toBeInTheDocument()
    })
  })
})
