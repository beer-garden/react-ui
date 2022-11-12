import { render, screen, waitFor } from '@testing-library/react'
import { mockAxios, regexUsers } from 'test/axios-mock'
import { TJob, TServerAuthConfig } from 'test/test-values'
import { AllProviders, LoggedInProviders } from 'test/testMocks'
import { TAdmin, TUser } from 'test/user-test-values'

import { JobIndex } from './JobIndex'

describe('JobIndex', () => {
  test('displays table with job data', async () => {
    render(
      <AllProviders>
        <JobIndex />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Request Scheduler' }),
      ).toBeInTheDocument()
    })
    expect(screen.getByText(TJob.name)).toBeInTheDocument()
    expect(screen.getByText(TJob.request_template.system)).toBeInTheDocument()
    expect(screen.getByText(TJob.request_template.command)).toBeInTheDocument()
    expect(screen.getByText(TJob.success_count as number)).toBeInTheDocument()
  })

  test('name and system are links', async () => {
    render(
      <AllProviders>
        <JobIndex />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText(TJob.name)).toBeInTheDocument()
    })
    const links: HTMLAnchorElement[] = screen.getAllByRole('link')
    expect(links[0].textContent).toEqual(TJob.name)
    expect(links[0].href).toContain(`http://localhost/#/jobs/${TJob.id}`)
    expect(links[1].textContent).toEqual(TJob.request_template.system)
    expect(links[1].href).toContain(
      `http://localhost/#/jobs/${TJob.request_template.namespace}/${TJob.request_template.system}`,
    )
  })

  test('alerts on failure to get jobs', async () => {
    mockAxios
      .onGet('/api/v1/jobs')
      .reply(404, { message: 'Failure to get jobs' })
    render(
      <AllProviders>
        <JobIndex />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText('ERROR: Failure to get jobs')).toBeInTheDocument()
    })
    expect(screen.queryByText(TJob.name)).not.toBeInTheDocument()
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
