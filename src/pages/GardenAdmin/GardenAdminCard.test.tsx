import { render, screen, waitFor } from '@testing-library/react'
import { PermissionsContainer } from 'containers/PermissionsContainer'
import { TGarden } from 'test/garden-test-values'
import { AllProviders } from 'test/testMocks'

import { GardenAdminCard } from './GardenAdminCard'

describe('GardenAdminCard', () => {
  test('should render garden data', async () => {
    render(
      <AllProviders>
        <GardenAdminCard garden={TGarden} setRequestStatus={jest.fn()} />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText(`${TGarden.name} (REMOTE)`)).toBeInTheDocument()
    })
    expect(screen.getByText(TGarden.status)).toBeInTheDocument()
    expect(screen.getByText(TGarden.namespaces.length)).toBeInTheDocument()
    expect(screen.getByText(TGarden.systems.length)).toBeInTheDocument()
  })

  describe('user has permission checks', () => {
    beforeEach(() => {
      jest.spyOn(PermissionsContainer, 'useContainer').mockReturnValue({
        hasGardenPermission: () => true,
        hasPermission: jest.fn(),
        hasSystemPermission: jest.fn(),
        hasJobPermission: jest.fn(),
        isPermissionsSet: jest.fn(),
      })
    })

    test('should show edit button when permission', async () => {
      render(
        <AllProviders>
          <GardenAdminCard garden={TGarden} setRequestStatus={jest.fn()} />
        </AllProviders>,
      )
      await waitFor(() => {
        expect(screen.getByText('Edit configurations')).toBeInTheDocument()
      })
    })

    test('should show delete button when permission', async () => {
      render(
        <AllProviders>
          <GardenAdminCard garden={TGarden} setRequestStatus={jest.fn()} />
        </AllProviders>,
      )
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Delete' }),
        ).toBeInTheDocument()
      })
    })
  })

  describe('user has no permission checks', () => {
    beforeEach(() => {
      jest.spyOn(PermissionsContainer, 'useContainer').mockReturnValue({
        hasGardenPermission: () => false,
        hasPermission: jest.fn(),
        hasSystemPermission: jest.fn(),
        hasJobPermission: jest.fn(),
        isPermissionsSet: jest.fn(),
      })
    })

    test('should hide edit button when no permission', async () => {
      render(
        <AllProviders>
          <GardenAdminCard garden={TGarden} setRequestStatus={jest.fn()} />
        </AllProviders>,
      )
      await waitFor(() => {
        expect(
          screen.queryByText('Edit configurations'),
        ).not.toBeInTheDocument()
      })
    })

    test('should hide delete button when no permission', async () => {
      render(
        <AllProviders>
          <GardenAdminCard garden={TGarden} setRequestStatus={jest.fn()} />
        </AllProviders>,
      )
      await waitFor(() => {
        expect(
          screen.queryByRole('button', { name: 'Delete' }),
        ).not.toBeInTheDocument()
      })
    })
  })
})
