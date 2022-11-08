import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { mockAxios, regexUsers } from 'test/axios-mock'
import { TJob, TServerAuthConfig } from 'test/test-values'
import { AllProviders, LoggedInProviders } from 'test/testMocks'
import { TAdmin, TUser } from 'test/user-test-values'

import { JobView } from './JobView'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => {
    return { id: '123test' }
  },
}))

describe('JobView', () => {
  afterAll(() => {
    jest.unmock('react-router-dom')
    jest.clearAllMocks()
  })

  test('run now runs the job', async () => {
    render(
      <AllProviders>
        <JobView />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText(`${TJob.name} ${TJob.id}`)).toBeInTheDocument()
    })
    fireEvent.click(screen.getByRole('button', { name: 'Run Now' }))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
    const alert = screen.getByRole('alert')
    expect(within(alert).getByText('Job running...')).toBeInTheDocument()
  })

  test('run now gets user permission to run interval job', async () => {
    mockAxios
      .onGet(`/api/v1/jobs/${TJob.id}`)
      .reply(200, Object.assign({}, TJob, { trigger_type: 'interval' }))
    render(
      <AllProviders>
        <JobView />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText(`${TJob.name} ${TJob.id}`)).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Run Now' }),
      ).toBeInTheDocument()
    })
    fireEvent.click(screen.getByRole('button', { name: 'Run Now' }))
    await waitFor(() => {
      expect(screen.getByText('Reset the Job Interval')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
    const alert = screen.getByRole('alert')
    expect(within(alert).getByText('Job running...')).toBeInTheDocument()
  })

  // TODO: for some reason these tests are broken
  describe('user does not have permission', () => {
    beforeAll(() => {
      mockAxios.onGet('/config').reply(200, TServerAuthConfig)
      mockAxios.onGet(regexUsers).reply(200, TUser)
    })

    test.skip('no Delete button', async () => {
      render(
        <LoggedInProviders>
          <JobView />
        </LoggedInProviders>,
      )
      await waitFor(() => {
        expect(screen.queryByText('Delete Job')).not.toBeInTheDocument()
      })
    })

    test.skip('no Update button', async () => {
      render(
        <LoggedInProviders>
          <JobView />
        </LoggedInProviders>,
      )
      await waitFor(() => {
        expect(screen.queryByText('Update Job')).not.toBeInTheDocument()
      })
    })

    test.skip('no Run button', async () => {
      render(
        <LoggedInProviders>
          <JobView />
        </LoggedInProviders>,
      )
      await waitFor(() => {
        expect(screen.queryByText('Run Now')).not.toBeInTheDocument()
      })
    })

    test.skip('no Pause button when jobs', async () => {
      render(
        <LoggedInProviders>
          <JobView />
        </LoggedInProviders>,
      )
      await waitFor(async () => {
        expect(screen.queryByText('Pause job')).not.toBeInTheDocument()
      })
    })

    test.skip('not render Resume or Pause buttons when jobs', async () => {
      render(
        <LoggedInProviders>
          <JobView />
        </LoggedInProviders>,
      )
      // slight cheat - job does not immediately exist and we check immediately
      await waitFor(() => {
        expect(screen.queryByText('Resume Job')).not.toBeInTheDocument()
      })
    })
  })

  describe('user has permission', () => {
    beforeAll(() => {
      mockAxios.onGet('/config').reply(200, TServerAuthConfig)
      mockAxios.onGet(regexUsers).reply(200, TAdmin)
    })

    test('renders Delete button', async () => {
      render(
        <LoggedInProviders>
          <JobView />
        </LoggedInProviders>,
      )
      await waitFor(() => {
        expect(screen.getByText('Delete Job')).toBeInTheDocument()
      })
    })

    test('renders Update button', async () => {
      render(
        <LoggedInProviders>
          <JobView />
        </LoggedInProviders>,
      )
      await waitFor(() => {
        expect(screen.getByText('Update Job')).toBeInTheDocument()
      })
    })

    test('renders Run button', async () => {
      render(
        <LoggedInProviders>
          <JobView />
        </LoggedInProviders>,
      )
      await waitFor(() => {
        expect(screen.getByText('Run Now')).toBeInTheDocument()
      })
    })

    test('not render Resume or Pause buttons if no jobs', async () => {
      render(
        <LoggedInProviders>
          <JobView />
        </LoggedInProviders>,
      )
      await waitFor(() => {
        expect(screen.queryByText('Resume Job')).not.toBeInTheDocument()
      })
    })

    test('render Pause button when jobs', async () => {
      render(
        <LoggedInProviders>
          <JobView />
        </LoggedInProviders>,
      )
      await waitFor(() => {
        expect(screen.getByText('Pause job')).toBeInTheDocument()
      })
    })
  })

  test('renders Job data if job', async () => {
    render(
      <AllProviders>
        <JobView />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText(`${TJob.name} ${TJob.id}`)).toBeInTheDocument()
    })
    expect(screen.getByText(TJob.request_template.system)).toBeInTheDocument()
    expect(screen.getByText('RUNNING')).toBeInTheDocument()
    expect(screen.getByText('Success Count:')).toBeInTheDocument()
    expect(screen.getByText('Error Count:')).toBeInTheDocument()
  })

  test('renders loading if no job', async () => {
    mockAxios.onGet(`/api/v1/jobs/${TJob.id}`).reply(200, undefined)
    render(
      <AllProviders>
        <JobView />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByTestId('dataLoading')).toBeInTheDocument()
    })
    // reset mock
    mockAxios.onGet(`/api/v1/jobs/${TJob.id}`).reply(200, TJob)
  })

  test('renders trigger and template JSON', async () => {
    render(
      <AllProviders>
        <JobView />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText('Trigger')).toBeInTheDocument()
    })
    expect(screen.getByText('Request Template')).toBeInTheDocument()
  })

  test('allows collapse trigger', async () => {
    render(
      <AllProviders>
        <JobView />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText('Trigger')).toBeInTheDocument()
    })
    fireEvent.click(screen.getAllByRole('button', { name: 'Expand Area' })[1])
    await waitFor(() => {
      expect(screen.queryByText('Trigger')).not.toBeInTheDocument()
    })
  })

  test('allows collapse template', async () => {
    render(
      <AllProviders>
        <JobView />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText('Request Template')).toBeInTheDocument()
    })
    fireEvent.click(screen.getAllByRole('button', { name: 'Expand Area' })[0])
    await waitFor(() => {
      expect(screen.queryByText('Request Template')).not.toBeInTheDocument()
    })
  })
})
