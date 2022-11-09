import { render, screen, waitFor } from '@testing-library/react'
import { mockAxios, regexUsers } from 'test/axios-mock'
import { TServerAuthConfig } from 'test/test-values'
import { LoggedInProviders } from 'test/testMocks'
import { TAdmin, TUser } from 'test/user-test-values'

import { JobIndex } from './JobIndex'

jest.mock('pages/JobIndex/jobIndexHelpers', () => ({
  getFormattedTable: jest.fn(),
}))

describe('JobIndex', () => {
  afterAll(() => {
    jest.unmock('pages/JobIndex/jobIndexHelpers')
    jest.clearAllMocks()
  })

  test('create button if permission', async () => {
    mockAxios.onGet('/config').reply(200, TServerAuthConfig)
    mockAxios.onGet(regexUsers).reply(200, TAdmin)
    render(
      <LoggedInProviders>
        <JobIndex />
      </LoggedInProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText('Create')).toBeInTheDocument()
    })
  })

  test('no create button if no permission', async () => {
    mockAxios.onGet('/config').reply(200, TServerAuthConfig)
    mockAxios.onGet(regexUsers).reply(200, TUser)
    render(
      <LoggedInProviders>
        <JobIndex />
      </LoggedInProviders>,
    )
    await waitFor(() => {
      expect(screen.queryByText('Create')).not.toBeInTheDocument()
    })
  })
})
