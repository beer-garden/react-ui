import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { selectItem } from 'test/testHelpers'
import { AllProviders } from 'test/testMocks'
import { TRolePatch } from 'test/user-test-values'

import { RoleCard } from './RoleCard'

describe('RoleCard', () => {
  test('renders card with inputs', async () => {
    render(
      <AllProviders>
        <RoleCard
          role={TRolePatch}
          setAlert={jest.fn()}
          setRole={jest.fn()}
          removeRole={jest.fn()}
        />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByLabelText('Role')).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.getByLabelText('Scope')).toBeInTheDocument()
    })
  })

  test('button to remove role', async () => {
    const mockFN = jest.fn()
    render(
      <AllProviders>
        <RoleCard
          role={TRolePatch}
          setAlert={jest.fn()}
          setRole={jest.fn()}
          removeRole={mockFN}
        />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByTestId('CloseIcon')).toBeInTheDocument()
    })
    fireEvent.click(screen.getAllByTestId('CloseIcon')[0])
    await waitFor(() => {
      expect(mockFN).toHaveBeenCalledTimes(1)
    })
  })

  test('change Role input', async () => {
    const mockFN = jest.fn()
    render(
      <AllProviders>
        <RoleCard
          role={TRolePatch}
          setAlert={jest.fn()}
          setRole={mockFN}
          removeRole={jest.fn()}
        />
      </AllProviders>,
    )
    await waitFor(() => {
      selectItem('Role', 'adminRole')
    })
    await waitFor(() => {
      expect(mockFN).toHaveBeenCalledWith(
        'adminRole',
        TRolePatch.domain.scope,
        TRolePatch.domain.identifiers,
      )
    })
  })

  test('change Scope input', async () => {
    const mockFN = jest.fn()
    render(
      <AllProviders>
        <RoleCard
          role={TRolePatch}
          setAlert={jest.fn()}
          setRole={mockFN}
          removeRole={jest.fn()}
        />
      </AllProviders>,
    )
    await waitFor(() => {
      selectItem('Scope', 'Garden')
    })
    await waitFor(() => {
      expect(mockFN).toHaveBeenCalledWith(
        TRolePatch.role_name,
        'Garden',
        TRolePatch.domain.identifiers,
      )
    })
  })

  test('correct identifiers for System scope', async () => {
    const testRole = Object.assign({}, TRolePatch, {
      domain: { scope: 'System', identifiers: { namespace: 'oldName' } },
    })
    render(
      <AllProviders>
        <RoleCard
          role={testRole}
          setAlert={jest.fn()}
          setRole={jest.fn()}
          removeRole={jest.fn()}
        />
      </AllProviders>,
    )
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Namespace')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByLabelText('Version')).toBeInTheDocument()
    })
  })

  test('correct identifiers for Garden scope', async () => {
    const testRole = Object.assign({}, TRolePatch, {
      domain: { scope: 'Garden', identifiers: { name: 'oldName' } },
    })
    render(
      <AllProviders>
        <RoleCard
          role={testRole}
          setAlert={jest.fn()}
          setRole={jest.fn()}
          removeRole={jest.fn()}
        />
      </AllProviders>,
    )
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.queryByLabelText('Namespace')).not.toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.queryByLabelText('Version')).not.toBeInTheDocument()
    })
  })

  test('correct identifiers for Global scope', async () => {
    render(
      <AllProviders>
        <RoleCard
          role={TRolePatch}
          setAlert={jest.fn()}
          setRole={jest.fn()}
          removeRole={jest.fn()}
        />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.queryByLabelText('Name')).not.toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.queryByLabelText('Namespace')).not.toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.queryByLabelText('Version')).not.toBeInTheDocument()
    })
  })

  test.each(['Name', 'Namespace', 'Version'])(
    'change System identifiers input',
    async (key) => {
      const testRole = Object.assign({}, TRolePatch, {
        domain: {
          scope: 'System',
          identifiers: { [key.toLowerCase()]: 'oldName' },
        },
      })
      const newIdentifiers = { [key.toLowerCase()]: 'newName' }
      const mockFN = jest.fn()
      render(
        <AllProviders>
          <RoleCard
            role={testRole}
            setAlert={jest.fn()}
            setRole={mockFN}
            removeRole={jest.fn()}
          />
        </AllProviders>,
      )
      fireEvent.change(screen.getByLabelText(key), {
        target: { value: 'newName' },
      })
      expect(testRole.domain.identifiers).toEqual(newIdentifiers)
      await waitFor(() => {
        expect(mockFN).toHaveBeenCalledWith(
          testRole.role_name,
          testRole.domain.scope,
          testRole.domain.identifiers,
        )
      })
    },
  )

  test('change Garden identifiers input', async () => {
    const testRole = Object.assign({}, TRolePatch, {
      domain: { scope: 'Garden', identifiers: { name: 'oldName' } },
    })
    const newIdentifiers = { name: 'newName' }
    const mockFN = jest.fn()
    render(
      <AllProviders>
        <RoleCard
          role={testRole}
          setAlert={jest.fn()}
          setRole={mockFN}
          removeRole={jest.fn()}
        />
      </AllProviders>,
    )
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'newName' },
    })
    expect(testRole.domain.identifiers).toEqual(newIdentifiers)
    await waitFor(() => {
      expect(mockFN).toHaveBeenCalledWith(
        testRole.role_name,
        testRole.domain.scope,
        testRole.domain.identifiers,
      )
    })
  })
})
