import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { mockAxios, regexUsers } from 'test/axios-mock'
import { AllProviders } from 'test/testMocks'
import {
  TAdmin,
  TAdminRoleAssignment,
  TRoleAssignment,
  TUser,
} from 'test/user-test-values'

import { UsersView } from './UsersView'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => {
    return {
      userName: 'someUser',
    }
  },
}))

const rolesUser = Object.assign({}, TUser, {
  role_assignments: [TRoleAssignment, TAdminRoleAssignment],
})

describe('UsersIndex', () => {
  afterAll(() => {
    jest.unmock('react-router-dom')
    jest.clearAllMocks()
  })

  test('render info for user with no remote garden', async () => {
    render(
      <AllProviders>
        <UsersView />
      </AllProviders>,
    )
    expect(screen.getByText('Change Password')).toBeInTheDocument()
    expect(screen.getByText('Role Assignments')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText(TUser.username)).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.queryByText('Sync Status')).not.toBeInTheDocument()
    })
  })

  test('render sync table with remote garden', async () => {
    mockAxios.onGet(regexUsers).reply(200, TAdmin)
    render(
      <AllProviders>
        <UsersView />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText('Sync Status')).toBeInTheDocument()
    })
  })

  test('render button to remove user', async () => {
    render(
      <AllProviders>
        <UsersView />
      </AllProviders>,
    )
    const btn = await screen.findByTestId('DeleteIcon')
    expect(btn).toBeInTheDocument()
  })

  test('must confirm user remove', async () => {
    render(
      <AllProviders>
        <UsersView />
      </AllProviders>,
    )
    const btn = await screen.findByTestId('DeleteIcon')
    expect(btn).toBeInTheDocument()
    fireEvent.click(btn)
    await waitFor(() => {
      expect(screen.getByText('Submit')).toBeInTheDocument()
    })
  })

  test('save user', async () => {
    render(
      <AllProviders>
        <UsersView />
      </AllProviders>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    await waitFor(() => {
      expect(
        screen.getByText('SUCCESS: Successfully updated user'),
      ).toBeInTheDocument()
    })
  })

  test('change passwords', async () => {
    render(
      <AllProviders>
        <UsersView />
      </AllProviders>,
    )
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'notSecret' },
    })
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'notSecret' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    await waitFor(() => {
      expect(
        screen.getByText('SUCCESS: Successfully updated user'),
      ).toBeInTheDocument()
    })
  })

  test('warn bad password confirm', async () => {
    render(
      <AllProviders>
        <UsersView />
      </AllProviders>,
    )
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'notSecret' },
    })
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'badPW' },
    })
    await waitFor(() => {
      expect(screen.getByText('Passwords must match')).toBeInTheDocument()
    })
  })

  test('one card per role', async () => {
    mockAxios.onGet(regexUsers).reply(200, rolesUser)
    const { container } = render(
      <AllProviders>
        <UsersView />
      </AllProviders>,
    )
    await waitFor(() => {
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.getElementsByClassName('MuiCard-root').length).toEqual(2)
    })
  })

  test('remove role', async () => {
    mockAxios.onGet(regexUsers).reply(200, rolesUser)
    const { container } = render(
      <AllProviders>
        <UsersView />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(
        screen.getAllByRole('button', { name: 'Remove Role' })[0],
      ).toBeInTheDocument()
    })
    fireEvent.click(screen.getAllByRole('button', { name: 'Remove Role' })[0])
    await waitFor(() => {
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.getElementsByClassName('MuiCard-root').length).toEqual(1)
    })
  })

  test('add role', async () => {
    mockAxios.onGet(regexUsers).reply(200, rolesUser)
    const { container } = render(
      <AllProviders>
        <UsersView />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Add new role' }),
      ).toBeInTheDocument()
    })
    fireEvent.click(screen.getByRole('button', { name: 'Add new role' }))
    await waitFor(() => {
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.getElementsByClassName('MuiCard-root').length).toEqual(3)
    })
  })
})
