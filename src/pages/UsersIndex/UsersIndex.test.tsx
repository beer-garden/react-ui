import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { mockAxios, regexUsers } from 'test/axios-mock'
import { TServerAuthConfig } from 'test/test-values'
import { AllProviders, LoggedInProviders } from 'test/testMocks'
import { TAdmin, TUser } from 'test/user-test-values'

import { UsersIndex } from './UsersIndex'

describe('UsersIndex', () => {
  test('render table of current users', async () => {
    render(
      <AllProviders>
        <UsersIndex />
      </AllProviders>,
    )
    expect(screen.getByText('User Management')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText(TUser.username)).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.queryByText(TAdmin.username)).not.toBeInTheDocument()
    })
  })

  test('user in table is clickable', async () => {
    render(
      <AllProviders>
        <UsersIndex />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText(TUser.username)).toBeInTheDocument()
    })
    const links: HTMLAnchorElement[] = screen.getAllByRole('link')
    expect(links[0].textContent).toEqual(TUser.username)
    expect(links[0].href).toContain(
      `http://localhost/#/admin/users/${TUser.username}`,
    )
  })

  test('render button to add user', async () => {
    mockAxios.onGet('/config').reply(200, TServerAuthConfig)
    mockAxios.onGet(regexUsers).reply(200, TAdmin)
    render(
      <LoggedInProviders>
        <UsersIndex />
      </LoggedInProviders>,
    )
    await waitFor(() => {
      expect(screen.getByTestId('AddIcon')).toBeInTheDocument()
    })
  })

  test('no add user button if no permission', async () => {
    mockAxios.onGet('/config').reply(200, TServerAuthConfig)
    render(
      <LoggedInProviders>
        <UsersIndex />
      </LoggedInProviders>,
    )
    await waitFor(() =>
      expect(screen.queryByTestId('AddIcon')).not.toBeInTheDocument(),
    )
  })

  test('no sync button if no sync status', async () => {
    mockAxios.onGet('/config').reply(200, TServerAuthConfig)
    mockAxios.onGet(regexUsers).reply(200, TAdmin)
    render(
      <LoggedInProviders>
        <UsersIndex />
      </LoggedInProviders>,
    )
    await waitFor(() =>
      expect(
        screen.queryByRole('button', { name: 'Sync user' }),
      ).not.toBeInTheDocument(),
    )
  })

  test('render button to sync user', async () => {
    mockAxios.onGet('/config').reply(200, TServerAuthConfig)
    mockAxios.onGet(regexUsers).reply(200, TAdmin)
    mockAxios.onGet('/api/v1/users').reply(200, { users: [TAdmin] })
    render(
      <LoggedInProviders>
        <UsersIndex />
      </LoggedInProviders>,
    )
    const btn = await screen.findByRole('button', { name: 'Sync user' })
    expect(btn).toBeInTheDocument()
  })

  test('table unchanged on cancel', async () => {
    mockAxios.onGet('/api/v1/users').reply(200, { users: [TUser] })
    render(
      <AllProviders>
        <UsersIndex />
      </AllProviders>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Add user' }))
    const cancelBtn = screen.getByText('Cancel')
    expect(cancelBtn).toBeInTheDocument()
    fireEvent.change(screen.getByRole('textbox', { name: 'Username' }), {
      target: { value: TAdmin.username },
    })
    fireEvent.change(screen.getByLabelText('Password *'), {
      target: { value: 'notSecret' },
    })
    fireEvent.change(screen.getByLabelText('Confirm Password *'), {
      target: { value: 'notSecret' },
    })
    fireEvent.click(cancelBtn)
    await waitFor(() => {
      expect(cancelBtn).not.toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.queryByText(TAdmin.username)).not.toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.getByText(TUser.username)).toBeInTheDocument()
    })
  })

  test('adds user to table', async () => {
    render(
      <AllProviders>
        <UsersIndex />
      </AllProviders>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Add user' }))
    mockAxios.onGet('/api/v1/users').reply(200, { users: [TUser, TAdmin] })
    fireEvent.change(screen.getByRole('textbox', { name: 'Username' }), {
      target: { value: TAdmin.username },
    })
    fireEvent.change(screen.getByLabelText('Password *'), {
      target: { value: 'notSecret' },
    })
    fireEvent.change(screen.getByLabelText('Confirm Password *'), {
      target: { value: 'notSecret' },
    })
    fireEvent.click(screen.getByText('Submit'))
    const tableData = await waitFor(() => {
      return screen.getAllByRole('rowgroup')[1]
    })
    await waitFor(() => {
      expect(within(tableData).getByText(TAdmin.username)).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(within(tableData).getByText(TUser.username)).toBeInTheDocument()
    })
  })
})
