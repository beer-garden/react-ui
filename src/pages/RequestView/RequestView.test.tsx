import { render, screen, waitFor } from '@testing-library/react'
import WS from 'jest-websocket-mock'
import Router from 'react-router-dom'
import { mockAxios } from 'test/axios-mock'
import { TChildRequest, TRequest } from 'test/test-values'
import { AllProviders } from 'test/testMocks'

import { RequestView } from './RequestView'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}))

const mockId = TRequest.id as string

describe('RequestView', () => {
  window.URL.createObjectURL = jest.fn(() => 'url')
  let server: WS

  beforeEach(() => {
    server = new WS('ws://localhost:2337/api/v1/socket/events')
  })

  afterEach(() => {
    WS.clean()
  })

  afterAll(() => {
    jest.unmock('react-router-dom')
    jest.clearAllMocks()
  })

  test('renders Request View page with contents', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ id: mockId })
    render(
      <AllProviders>
        <RequestView />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText(mockId)).toBeInTheDocument()
    })
    expect(
      screen.getByRole('heading', { name: 'Request View' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Output' })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Parameters' }),
    ).toBeInTheDocument()
  })

  test('refetches page contents when REQUEST_COMPLETED event occurs and requestId matches', async () => {
    const mockInProgressResponse = Object.assign({}, TRequest, {
      status: 'IN PROGRESS',
    })
    jest.spyOn(Router, 'useParams').mockReturnValue({ id: mockId })
    mockAxios.onGet('/api/v1/requests/1234').reply(200, mockInProgressResponse)
    render(
      <AllProviders>
        <RequestView />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText(mockId)).toBeInTheDocument()
    })
    // should be in progress
    expect(screen.queryByText('SUCCESS')).not.toBeInTheDocument()
    expect(screen.getByText('IN PROGRESS')).toBeInTheDocument()
    expect(screen.queryByText('test output')).not.toBeInTheDocument()
    // send request completed event
    const mockEvent = {
      name: 'REQUEST_COMPLETED',
      payload: TRequest,
    }
    mockAxios.onGet('/api/v1/requests/1234').reply(200, TRequest)
    server.send(JSON.stringify(mockEvent))
    await waitFor(() => {
      expect(screen.queryByText('IN PROGRESS')).not.toBeInTheDocument()
    })
    expect(screen.getByText('SUCCESS')).toBeInTheDocument()
    expect(screen.getByText('test output')).toBeInTheDocument()
  })

  test('does not refetch page contents when REQUEST_COMPLETED event occurs and requestId does not match', async () => {
    const mockInProgressResponse = Object.assign({}, TRequest, {
      status: 'IN PROGRESS',
    })
    jest.spyOn(Router, 'useParams').mockReturnValue({ id: mockId })
    mockAxios.onGet('/api/v1/requests/1234').reply(200, mockInProgressResponse)
    render(
      <AllProviders>
        <RequestView />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText(mockId)).toBeInTheDocument()
    })
    // should be in progress
    expect(screen.queryByText('SUCCESS')).not.toBeInTheDocument()
    expect(screen.getByText('IN PROGRESS')).toBeInTheDocument()
    expect(screen.queryByText('test output')).not.toBeInTheDocument()
    // send request complete event for different requestid
    const mockEventOther = {
      name: 'REQUEST_COMPLETED',
      payload: Object.assign({}, TRequest, { id: '5678' }),
    }
    server.send(JSON.stringify(mockEventOther))
    expect(screen.queryByText('SUCCESS')).not.toBeInTheDocument()
    expect(screen.getByText('IN PROGRESS')).toBeInTheDocument()
    expect(screen.queryByText('test output')).not.toBeInTheDocument()
  })

  test('renders breadcrumbs if parent', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ id: mockId })
    mockAxios.onGet('/api/v1/requests/1234').reply(200, TChildRequest)
    render(
      <AllProviders>
        <RequestView />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText(TRequest.command)).toHaveAttribute(
        'href',
        `#/requests/${TRequest.id}`,
      )
    })
    expect(screen.getByTestId('CommandLink')).toHaveAttribute(
      'href',
      `#/systems/${TChildRequest.namespace}/${TChildRequest.system}/${TChildRequest.system_version}/commands/${TChildRequest.command}`,
    )
    mockAxios.onGet('/api/v1/requests/1234').reply(200, TRequest)
  })

  test('renders alert if error', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ id: mockId })
    mockAxios.onGet('/api/v1/requests/1234').reply(404, {})
    render(
      <AllProviders>
        <RequestView />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText('Problem: Wrong identifier')).toBeInTheDocument()
    })
    mockAxios.onGet('/api/v1/requests/1234').reply(200, TRequest)
  })

  test('renders loading wheel if no data', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ id: mockId })
    mockAxios.onGet('/api/v1/requests/1234').reply(200, undefined)
    render(
      <AllProviders>
        <RequestView />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByTitle('dataLoading')).toBeInTheDocument()
    })
    mockAxios.onGet('/api/v1/requests/1234').reply(200, TRequest)
  })
})
