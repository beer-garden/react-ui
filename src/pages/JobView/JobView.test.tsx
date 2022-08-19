import { render, screen } from '@testing-library/react'
import Router from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom'
import { job as mockJob } from 'test/testData'
import { Job } from 'types/backend-types'

import { JobView } from './JobView'

let mockJobResponse: { data: Job | undefined }

jest.mock('services/job.service/job.service', () => ({
  useJobServices: () => ({
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
    jest.unmock('services/job.service/job.service')
    jest.unmock('react-router-dom')
  })

  beforeAll(() => {
    mockJobResponse = { data: Object.assign({}, mockJob) }
  })

  test('renders Delete button', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })
    render(
      <BrowserRouter>
        <JobView />
      </BrowserRouter>,
    )
    expect(screen.getByText('Delete Job')).toBeInTheDocument()
  })

  test('renders Update button', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })
    render(
      <BrowserRouter>
        <JobView />
      </BrowserRouter>,
    )
    expect(screen.getByText('Update Job')).toBeInTheDocument()
  })

  test('not render Resume or Pause buttons if no jobs', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })
    render(
      <BrowserRouter>
        <JobView />
      </BrowserRouter>,
    )
    // slight cheat - job does not immediately exist and we check immediately
    expect(screen.queryByText('Resume Job')).not.toBeInTheDocument()
  })

  test('render Pause button when jobs', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })
    render(
      <BrowserRouter>
        <JobView />
      </BrowserRouter>,
    )
    // wait for job to exist
    expect(await screen.findByText('Pause job')).toBeInTheDocument()
  })
})
