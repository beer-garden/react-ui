import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { DebugContainer } from 'containers/DebugContainer'
import { BrowserRouter } from 'react-router-dom'
import { TJob } from 'test/test-values'
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
      <BrowserRouter>
        <DebugContainer.Provider>
          <JobButton id="24" job={jData} callback={mockFn} />
        </DebugContainer.Provider>
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
        <DebugContainer.Provider>
          <JobButton id="24" job={jData} callback={mockFn} />
        </DebugContainer.Provider>
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
        <DebugContainer.Provider>
          <JobButton id="24" job={jData} callback={jest.fn} />
        </DebugContainer.Provider>
      </BrowserRouter>,
    )
    expect(screen.getByText('Pause job')).toBeInTheDocument()
  })

  test('render resume button when job is not running', () => {
    jData.status = 'STOPPED'
    render(
      <BrowserRouter>
        <DebugContainer.Provider>
          <JobButton id="24" job={jData} callback={jest.fn} />
        </DebugContainer.Provider>
      </BrowserRouter>,
    )
    expect(screen.getByText('Resume job')).toBeInTheDocument()
  })
})
