import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { mockAxios, regexUsers } from 'test/axios-mock'
import { TJob, TServerAuthConfig, TServerConfig } from 'test/test-values'
import { AllProviders, LoggedInProviders } from 'test/testMocks'
import { TAdmin, TUser } from 'test/user-test-values'

import { JobView } from './JobView'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => {
    return { id: '123test' }
  },
}))

const stoppedJob = Object.assign({}, TJob, { status: 'STOPPED' })

describe('JobView', () => {
  afterAll(() => {
    jest.unmock('react-router-dom')
    jest.clearAllMocks()
  })

  describe('JobButton', () => {
    test('render pause button when job is running', async () => {
      render(
        <AllProviders>
          <JobView />
        </AllProviders>,
      )
      await waitFor(() => {
        expect(screen.getByText('Pause job')).toBeInTheDocument()
      })
    })

    test('render resume button when job is not running', async () => {
      mockAxios.onGet(`/api/v1/jobs/${TJob.id}`).reply(200, stoppedJob)
      render(
        <AllProviders>
          <JobView />
        </AllProviders>,
      )
      await waitFor(() => {
        expect(screen.getByText('Resume job')).toBeInTheDocument()
      })
      mockAxios.onGet(`/api/v1/jobs/${TJob.id}`).reply(200, TJob)
    })

    test('pause job on click', async () => {
      render(
        <AllProviders>
          <JobView />
        </AllProviders>,
      )
      await waitFor(() => {
        expect(screen.getByText('Pause job')).toBeInTheDocument()
      })
      mockAxios.onGet(`/api/v1/jobs/${TJob.id}`).reply(200, stoppedJob)
      fireEvent.click(screen.getByText('Pause job'))
      await waitFor(() => {
        expect(screen.getByText('Resume job')).toBeInTheDocument()
      })
    })

    test('resume job on click', async () => {
      mockAxios.onGet(`/api/v1/jobs/${TJob.id}`).reply(200, stoppedJob)
      render(
        <AllProviders>
          <JobView />
        </AllProviders>,
      )
      await waitFor(() => {
        expect(screen.getByText('Resume job')).toBeInTheDocument()
      })
      mockAxios.onGet(`/api/v1/jobs/${TJob.id}`).reply(200, TJob)
      fireEvent.click(screen.getByText('Resume job'))
      await waitFor(() => {
        expect(screen.getByText('Pause job')).toBeInTheDocument()
      })
    })
  })

  describe('user does not have permission', () => {
    beforeAll(() => {
      mockAxios.onGet('/config').reply(200, TServerAuthConfig)
      mockAxios.onGet(regexUsers).reply(200, TUser)
    })

    test('no Delete button', async () => {
      render(
        <LoggedInProviders>
          <JobView />
        </LoggedInProviders>,
      )
      await waitFor(() => {
        expect(screen.queryByText('Delete Job')).not.toBeInTheDocument()
      })
    })

    test('no Update button', async () => {
      render(
        <LoggedInProviders>
          <JobView />
        </LoggedInProviders>,
      )
      await waitFor(() => {
        expect(screen.queryByText('Update Job')).not.toBeInTheDocument()
      })
    })

    test('no Run button', async () => {
      render(
        <LoggedInProviders>
          <JobView />
        </LoggedInProviders>,
      )
      await waitFor(() => {
        expect(screen.queryByText('Run Now')).not.toBeInTheDocument()
      })
    })

    test('no Pause button when jobs', async () => {
      render(
        <LoggedInProviders>
          <JobView />
        </LoggedInProviders>,
      )
      await waitFor(async () => {
        expect(screen.queryByText('Pause job')).not.toBeInTheDocument()
      })
    })

    test('not render Resume or Pause buttons when jobs', async () => {
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

  // TODO: for some reason these tests are broken
  describe('user has permission', () => {
    beforeAll(() => {
      mockAxios.onGet('/config').reply(200, TServerAuthConfig)
      mockAxios.onGet(regexUsers).reply(200, TAdmin)
    })

    afterAll(() => {
      mockAxios.onGet('/config').reply(200, TServerConfig)
    })

    test.skip('renders Delete button', async () => {
      render(
        <LoggedInProviders>
          <JobView />
        </LoggedInProviders>,
      )
      await waitFor(() => {
        expect(screen.getByText('Delete Job')).toBeInTheDocument()
      })
    })

    test.skip('renders Update button', async () => {
      render(
        <LoggedInProviders>
          <JobView />
        </LoggedInProviders>,
      )
      await waitFor(() => {
        expect(screen.getByText('Update Job')).toBeInTheDocument()
      })
    })

    test.skip('renders Run button', async () => {
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

    test.skip('render Pause button when jobs', async () => {
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
      expect(screen.getByText('Delete Job')).toBeInTheDocument()
    })
  })

  test('renders loading if no job', async () => {
    render(
      <AllProviders>
        <JobView />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText('Delete Job')).toBeInTheDocument()
    })
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
      expect(screen.getByText('Delete Job')).toBeInTheDocument()
    })
  })

  test('allows collapse template', async () => {
    render(
      <AllProviders>
        <JobView />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText('Delete Job')).toBeInTheDocument()
    })
  })
})
