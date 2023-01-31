import { render, screen, waitFor } from '@testing-library/react'
import { PermissionsContainer } from 'containers/PermissionsContainer'
import { TSystem } from 'test/system-test-values'
import { TAugmentedCommand } from 'test/test-values'
import { AllProviders } from 'test/testMocks'

import { ExecuteButton } from './ExecuteButton'

describe('ExecuteButton', () => {
  test('execute button if permission', async () => {
    jest.spyOn(PermissionsContainer, 'useContainer').mockReturnValue({
      hasGardenPermission: jest.fn(),
      hasPermission: () => true,
      hasSystemPermission: jest.fn(),
      hasJobPermission: jest.fn(),
      isPermissionsSet: jest.fn(),
    })
    render(
      <AllProviders>
        <ExecuteButton system={TSystem} command={TAugmentedCommand} />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText('Execute')).toBeInTheDocument()
    })
  })

  test('disabled execute button if no permission', async () => {
    jest.spyOn(PermissionsContainer, 'useContainer').mockReturnValue({
      hasGardenPermission: jest.fn(),
      hasPermission: () => false,
      hasSystemPermission: jest.fn(),
      hasJobPermission: jest.fn(),
      isPermissionsSet: jest.fn(),
    })
    render(
      <AllProviders>
        <ExecuteButton system={TSystem} command={TAugmentedCommand} />
      </AllProviders>,
    )
    // check button is disabled, but its aria-disabled
    await waitFor(() => {
      expect(screen.queryByText('Execute')).toHaveAttribute(
        'aria-disabled',
        'true',
      )
    })
  })
})
