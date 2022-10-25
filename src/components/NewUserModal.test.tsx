import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { AllProviders } from 'test/testMocks'

import NewUserModal from './NewUserModal'

describe('NewUser Modal', () => {
  test('renders modal window with contents', async () => {
    render(
      <AllProviders>
        <NewUserModal open={true} setOpen={jest.fn()} updateUsers={jest.fn()} />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Create User' }),
      ).toBeInTheDocument()
    })
    expect(
      screen.getByRole('textbox', { name: 'Username' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
  })

  test('accepts valid input', async () => {
    const mockFn = jest.fn()
    render(
      <AllProviders>
        <NewUserModal open={true} setOpen={jest.fn()} updateUsers={mockFn} />
      </AllProviders>,
    )
    fireEvent.change(screen.getByRole('textbox', { name: 'Username' }), {
      target: { value: 'testUser' },
    })
    fireEvent.change(screen.getByLabelText('Password *'), {
      target: { value: 'notSecret' },
    })
    fireEvent.change(screen.getByLabelText('Confirm Password *'), {
      target: { value: 'notSecret' },
    })
    fireEvent.click(screen.getByText('Submit'))
    await waitFor(() => {
      expect(
        screen.getByText('SUCCESS: User testUser successfully created!'),
      ).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(
        screen.queryByText('ERROR: Please fill out entire form properly'),
      ).not.toBeInTheDocument()
    })
  })

  test('snackbar on bad form data', async () => {
    const mockFn = jest.fn()
    render(
      <AllProviders>
        <NewUserModal open={true} setOpen={jest.fn()} updateUsers={mockFn} />
      </AllProviders>,
    )
    fireEvent.change(screen.getByLabelText('Password *'), {
      target: { value: 'notSecret' },
    })
    fireEvent.change(screen.getByLabelText('Confirm Password *'), {
      target: { value: 'notSecret' },
    })
    fireEvent.click(screen.getByText('Submit'))
    await waitFor(() => {
      expect(screen.queryByText('Passwords must match')).not.toBeInTheDocument()
    })
    await waitFor(() => {
      expect(
        screen.getByText('ERROR: Please fill out entire form properly'),
      ).toBeInTheDocument()
    })
  })

  test('warn bad password confirm', async () => {
    const mockFn = jest.fn()
    render(
      <AllProviders>
        <NewUserModal open={true} setOpen={jest.fn()} updateUsers={mockFn} />
      </AllProviders>,
    )
    fireEvent.change(screen.getByRole('textbox', { name: 'Username' }), {
      target: { value: 'testUser' },
    })
    fireEvent.change(screen.getByLabelText('Password *'), {
      target: { value: 'notSecret' },
    })
    fireEvent.change(screen.getByLabelText('Confirm Password *'), {
      target: { value: 'badPW' },
    })
    fireEvent.click(screen.getByText('Submit'))
    await waitFor(() => {
      expect(screen.getByText('Passwords must match')).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(
        screen.getByText('ERROR: Please fill out entire form properly'),
      ).toBeInTheDocument()
    })
  })
})
