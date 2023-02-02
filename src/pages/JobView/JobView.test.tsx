import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { PermissionsContainer } from 'containers/PermissionsContainer'
import { mockAxios } from 'test/axios-mock'
import { TJob } from 'test/test-values'
import { AllProviders } from 'test/testMocks'
import { Job } from 'types/backend-types'

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

  beforeEach(() => {
    jest.spyOn(PermissionsContainer, 'useContainer').mockReturnValue({
      hasGardenPermission: jest.fn(),
      hasPermission: jest.fn(),
      hasSystemPermission: jest.fn(),
      hasJobPermission: (p: string, j: Job): Promise<boolean> =>
        Promise.resolve(true),
      isPermissionsSet: jest.fn(),
    })
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
    beforeEach(() => {
      jest.spyOn(PermissionsContainer, 'useContainer').mockReturnValue({
        hasGardenPermission: jest.fn(),
        hasPermission: jest.fn(),
        hasSystemPermission: jest.fn(),
        hasJobPermission: (p: string, j: Job): Promise<boolean> =>
          Promise.resolve(false),
        isPermissionsSet: jest.fn(),
      })
    })

    test('no Delete button', async () => {
      render(
        <AllProviders>
          <JobView />
        </AllProviders>,
      )
      await waitFor(() => {
        expect(screen.getByText(`${TJob.name} ${TJob.id}`)).toBeInTheDocument()
      })
      await waitFor(() => {
        expect(screen.queryByText('Delete Job')).not.toBeInTheDocument()
      })
    })

    test('no Update button', async () => {
      render(
        <AllProviders>
          <JobView />
        </AllProviders>,
      )
      await waitFor(() => {
        expect(screen.getByText(`${TJob.name} ${TJob.id}`)).toBeInTheDocument()
      })
      await waitFor(() => {
        expect(screen.queryByText('Update Job')).not.toBeInTheDocument()
      })
    })

    test('no Run button', async () => {
      render(
        <AllProviders>
          <JobView />
        </AllProviders>,
      )
      await waitFor(() => {
        expect(screen.getByText(`${TJob.name} ${TJob.id}`)).toBeInTheDocument()
      })
      await waitFor(() => {
        expect(screen.queryByText('Run Now')).not.toBeInTheDocument()
      })
    })

    test('no Pause button when jobs', async () => {
      render(
        <AllProviders>
          <JobView />
        </AllProviders>,
      )
      await waitFor(() => {
        expect(screen.getByText(`${TJob.name} ${TJob.id}`)).toBeInTheDocument()
      })
      await waitFor(async () => {
        expect(screen.queryByText('Pause job')).not.toBeInTheDocument()
      })
    })

    test('not render Resume or Pause buttons when jobs', async () => {
      render(
        <AllProviders>
          <JobView />
        </AllProviders>,
      )
      await waitFor(() => {
        expect(screen.getByText(`${TJob.name} ${TJob.id}`)).toBeInTheDocument()
      })
      await waitFor(() => {
        expect(screen.queryByText('Resume Job')).not.toBeInTheDocument()
      })
    })
  })

  describe('user has permission', () => {
    test('renders Delete button', async () => {
      render(
        <AllProviders>
          <JobView />
        </AllProviders>,
      )
      await waitFor(() => {
        expect(screen.getByText('Delete Job')).toBeInTheDocument()
      })
    })

    test('renders Update button', async () => {
      render(
        <AllProviders>
          <JobView />
        </AllProviders>,
      )
      await waitFor(() => {
        expect(screen.getByText('Update Job')).toBeInTheDocument()
      })
    })

    test('renders Run button', async () => {
      render(
        <AllProviders>
          <JobView />
        </AllProviders>,
      )
      await waitFor(() => {
        expect(screen.getByText('Run Now')).toBeInTheDocument()
      })
    })

    test('not render Resume or Pause buttons if no jobs', async () => {
      render(
        <AllProviders>
          <JobView />
        </AllProviders>,
      )
      await waitFor(() => {
        expect(screen.queryByText('Resume Job')).not.toBeInTheDocument()
      })
    })

    test('render Pause button when jobs', async () => {
      render(
        <AllProviders>
          <JobView />
        </AllProviders>,
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
      expect(screen.getByTitle('loading circle')).toBeInTheDocument()
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

  test('makes user confirm to delete job', async () => {
    render(
      <AllProviders>
        <JobView />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Delete job' }),
      ).toBeInTheDocument()
    })
    fireEvent.click(screen.getByRole('button', { name: 'Delete job' }))
    expect(screen.getByText('Delete Job?')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    await waitFor(() => {
      expect(screen.queryByText('Delete Job?')).not.toBeInTheDocument()
    })
  })
})
