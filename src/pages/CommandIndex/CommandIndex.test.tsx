import { render, screen, waitFor } from '@testing-library/react'
import { PermissionsContainer } from 'containers/PermissionsContainer'
import Router from 'react-router-dom'
import { TSystem } from 'test/system-test-values'
import { AllProviders, LoggedInProviders } from 'test/testMocks'

import { CommandIndex } from './CommandIndex'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}))

describe('CommandIndex', () => {
  afterAll(() => {
    jest.unmock('react-router-dom')
    jest.clearAllMocks()
  })

  test('render table of commands', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({
      systemName: TSystem.name,
      namespace: TSystem.namespace,
      version: TSystem.version,
    })
    render(
      <AllProviders>
        <CommandIndex />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText('Commands')).toBeInTheDocument()
    })
  })

  test('execute button column if permission', async () => {
    jest.spyOn(PermissionsContainer, 'useContainer').mockReturnValue({
      hasPermission: jest.fn(),
      hasGardenPermission: jest.fn(),
      hasJobPermission: jest.fn(),
      isPermissionsSet: jest.fn(),
      hasSystemPermission: () => Promise.resolve(true),
    })
    jest.spyOn(Router, 'useParams').mockReturnValue({
      systemName: TSystem.name,
      namespace: TSystem.namespace,
      version: TSystem.version,
    })
    render(
      <LoggedInProviders>
        <CommandIndex />
      </LoggedInProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText('Execute')).toBeInTheDocument()
    })
  })

  test('no execute column if no permission', async () => {
    jest.spyOn(PermissionsContainer, 'useContainer').mockReturnValue({
      hasPermission: jest.fn(),
      hasGardenPermission: jest.fn(),
      hasJobPermission: jest.fn(),
      isPermissionsSet: jest.fn(),
      hasSystemPermission: () => Promise.resolve(true),
    })
    jest.spyOn(Router, 'useParams').mockReturnValue({
      systemName: TSystem.name,
      namespace: TSystem.namespace,
      version: TSystem.version,
    })
    render(
      <LoggedInProviders>
        <CommandIndex />
      </LoggedInProviders>,
    )
    await waitFor(() => {
      expect(screen.queryByText('Execute')).not.toBeInTheDocument()
    })
  })
})
