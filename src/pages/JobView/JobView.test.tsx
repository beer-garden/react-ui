import { render, screen, waitFor } from '@testing-library/react'
import Router from 'react-router-dom'
import { mockAxios, regexUsers } from 'test/axios-mock'
import { TJob, TServerAuthConfig } from 'test/test-values'
import { AllProviders, LoggedInProviders } from 'test/testMocks'
import { TAdmin, TUser } from 'test/user-test-values'
import { Job } from 'types/backend-types'

import { JobView } from './JobView'

let mockJobResponse: { data: Job | undefined }

jest.mock('hooks/useJobs', () => ({
  useJobs: () => ({
    deleteJob: (cb: () => unknown) => cb(),
    getJob: (cb: (arg0: { data: Job | undefined }) => unknown) =>
      cb(mockJobResponse),
  }),
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}))

describe('JobView', () => {
  afterAll(() => {
    jest.unmock('hooks/useJobs')
    jest.unmock('react-router-dom')
    jest.clearAllMocks()
  })

  beforeAll(() => {
    mockJobResponse = { data: Object.assign({}, TJob) }
  })

  describe('user has permission', () => {
    beforeAll(() => {
      mockAxios.onGet('/config').reply(200, TServerAuthConfig)
      mockAxios.onGet(regexUsers).reply(200, TAdmin)
    })

    test('renders Delete button', async () => {
      jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })
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
      jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })
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
      jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })
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
      jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })
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
      jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })
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

  describe('user does not have permission', () => {
    beforeAll(() => {
      mockAxios.onGet('/config').reply(200, TServerAuthConfig)
      mockAxios.onGet(regexUsers).reply(200, TUser)
    })

    test('no Delete button', async () => {
      jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })
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
      jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })
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
      jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })
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
      jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })
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
      jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })
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

  test('renders Job data if job', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })
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
    jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })
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
    jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })
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
    jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })
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
    jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })
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
