import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { mockAxios } from 'test/axios-mock'
import { AllProviders } from 'test/testMocks'
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

  test('render button to add user', async () => {
    render(
      <AllProviders>
        <UsersIndex />
      </AllProviders>,
    )
    const btn = await screen.findByRole('button', { name: 'Add user' })
    expect(btn).toBeInTheDocument()
  })

  test('table unchanged on cancel', async () => {
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
