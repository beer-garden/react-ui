import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { TJob } from 'test/test-values'
import { AllProviders } from 'test/testMocks'
import { Job } from 'types/backend-types'

import { JobButton } from './JobButton'

jest.mock('hooks/useJobs', () => ({
  useJobs: () => ({
    pauseJob: (cb: () => unknown) => cb(),
    resumeJob: (cb: () => unknown) => cb(),
  }),
}))

let jData: Job

describe('JobButton', () => {
  afterAll(() => jest.unmock('hooks/useJobs'))

  beforeEach(() => {
    jData = Object.assign({}, TJob)
  })

  test('pause job on click', async () => {
    const mockFn = jest.fn()
    render(
      <AllProviders>
        <JobButton id="24" job={jData} callback={mockFn} />
      </AllProviders>,
    )
    expect(screen.getByText('Pause job')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Pause job'))
    await waitFor(() => {
      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })

  test('resume job on click', async () => {
    jData.status = 'STOPPED'
    const mockFn = jest.fn()
    render(
      <AllProviders>
        <JobButton id="24" job={jData} callback={mockFn} />
      </AllProviders>,
    )
    expect(screen.getByText('Resume job')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Resume job'))
    await waitFor(() => {
      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })

  test('render pause button when job is running', async () => {
    render(
      <AllProviders>
        <JobButton id="24" job={jData} callback={jest.fn} />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText('Pause job')).toBeInTheDocument()
    })
  })

  test('render resume button when job is not running', async () => {
    jData.status = 'STOPPED'
    render(
      <AllProviders>
        <JobButton id="24" job={jData} callback={jest.fn} />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText('Resume job')).toBeInTheDocument()
    })
  })
})
