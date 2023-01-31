import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { AuthContainer } from 'containers/AuthContainer'
import { AllProviders } from 'test/testMocks'

import { LogoutButton } from './LogoutButton'

describe('LogoutButton', () => {
  test('logs user out when clicked', async () => {
    const logOutTrigger = jest.fn()
    jest.spyOn(AuthContainer, 'useContainer').mockReturnValue({
      user: 'admin',
      login: jest.fn(),
      logout: logOutTrigger,
      refreshToken: jest.fn(),
      isAuthenticated: jest.fn(),
      tokenExpiration: new Date(),
    })
    render(
      <AllProviders>
        <LogoutButton />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText('Logout')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText('Logout'))
    expect(logOutTrigger).toHaveBeenCalledTimes(1)
  })
})
