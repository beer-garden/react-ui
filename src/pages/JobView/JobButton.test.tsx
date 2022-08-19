import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { job as mockJob } from 'test/testData'
import { Job } from 'types/backend-types'

import { JobButton } from './JobButton'

jest.mock('services/job.service/job.service', () => ({
  useJobServices: () => ({
    pauseJob: (cb: () => unknown) => cb(),
    resumeJob: (cb: () => unknown) => cb(),
  }),
}))

let jData: Job

describe('JobButton', () => {
  afterAll(() => jest.unmock('services/job.service/job.service'))

  beforeEach(() => {
    jData = Object.assign({}, mockJob)
  })

  test('pause job on click', async () => {
    const mockFn = jest.fn()
    render(
      <BrowserRouter>
        <JobButton id="24" job={jData} callback={mockFn} />
      </BrowserRouter>,
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
      <BrowserRouter>
        <JobButton id="24" job={jData} callback={mockFn} />
      </BrowserRouter>,
    )
    expect(screen.getByText('Resume job')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Resume job'))
    await waitFor(() => {
      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })

  test('render pause button when job is running', () => {
    render(
      <BrowserRouter>
        <JobButton id="24" job={jData} callback={jest.fn} />
      </BrowserRouter>,
    )
    expect(screen.getByText('Pause job')).toBeInTheDocument()
  })

  test('render resume button when job is not running', () => {
    jData.status = 'STOPPED'
    render(
      <BrowserRouter>
        <JobButton id="24" job={jData} callback={jest.fn} />
      </BrowserRouter>,
    )
    expect(screen.getByText('Resume job')).toBeInTheDocument()
  })
})
