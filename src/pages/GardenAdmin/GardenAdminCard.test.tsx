import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import { mockAxios, regexUsers } from 'test/axios-mock'
import { TGarden } from 'test/garden-test-values'
import { TServerAuthConfig, TServerConfig } from 'test/test-values'
import { AllProviders, LoggedInProviders } from 'test/testMocks'
import { TAdmin, TUser } from 'test/user-test-values'

import { GardenAdminCard } from './GardenAdminCard'

describe('GardenAdminCard', () => {
  test('should render garden data', async () => {
    mockAxios.onGet(regexUsers).reply(200, TUser)
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

  describe('permission checks', () => {
    beforeAll(() => {
      mockAxios.onGet('/config').reply(200, TServerAuthConfig)
    })

    afterAll(() => {
      mockAxios.onGet('/config').reply(200, TServerConfig)
      mockAxios.onGet(regexUsers).reply(200, TUser)
    })

    test('should hide edit button when no permission', async () => {
      mockAxios.onGet(regexUsers).reply(200, TUser)
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

    test('should show edit button when permission', async () => {
      mockAxios.onGet(regexUsers).reply(200, TAdmin)
      render(
        <LoggedInProviders>
          <GardenAdminCard garden={TGarden} setRequestStatus={jest.fn()} />
        </LoggedInProviders>,
      )
      await waitFor(() => {
        expect(screen.getByText('Edit configurations')).toBeInTheDocument()
      })
    })

    test('should hide delete button when no permission', async () => {
      mockAxios.onGet(regexUsers).reply(200, TUser)
      render(
        <LoggedInProviders>
          <GardenAdminCard garden={TGarden} setRequestStatus={jest.fn()} />
        </LoggedInProviders>,
      )
      await waitFor(() => {
        expect(
          screen.queryByRole('button', { name: 'Delete' }),
        ).not.toBeInTheDocument()
      })
    })

    test('should show delete button when permission', async () => {
      mockAxios.onGet(regexUsers).reply(200, TAdmin)
      render(
        <LoggedInProviders>
          <GardenAdminCard garden={TGarden} setRequestStatus={jest.fn()} />
        </LoggedInProviders>,
      )
      await waitForElementToBeRemoved(() =>
        screen.queryByRole('button', { name: 'Delete' }),
      )
    })
  })
})
