import { render, screen, waitFor } from '@testing-library/react'
import * as useAxios from 'axios-hooks'
import WS from 'jest-websocket-mock'
import Router from 'react-router-dom'
import { TRequest } from 'test/test-values'
import { AllProviders } from 'test/testMocks'

import { RequestView } from './RequestView'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}))

jest.mock('axios-hooks', () => ({
  ...jest.requireActual('axios-hooks'),
  useAxios: jest.fn(),
}))

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
    jest.unmock('axios-hooks')
    jest.clearAllMocks()
  })

  test('renders Request View page with contents', async () => {
    const mockId = '1234'
    jest.spyOn(Router, 'useParams').mockReturnValue({ id: mockId })

    render(
      <AllProviders>
        <RequestView />
      </AllProviders>,
    )

    await waitFor(() => {
      expect(screen.getByText('Request View')).toBeInTheDocument()
    })

    expect(screen.getByText(mockId)).toBeInTheDocument()
    expect(screen.getByText('remake request')).toBeInTheDocument()

    expect(screen.getByText('Command')).toBeInTheDocument()
    expect(screen.getByText('test command')).toBeInTheDocument()

    expect(screen.getByText('Namespace')).toBeInTheDocument()
    expect(screen.getByText('test namespace')).toBeInTheDocument()

    expect(screen.getByText('System')).toBeInTheDocument()
    expect(screen.getByText('test system')).toBeInTheDocument()

    expect(screen.getByText('Version')).toBeInTheDocument()
    expect(screen.getByText('test version')).toBeInTheDocument()

    expect(screen.getByText('Instance')).toBeInTheDocument()
    expect(screen.getByText('test instance')).toBeInTheDocument()

    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('SUCCESS')).toBeInTheDocument()

    expect(screen.getByText('Created')).toBeInTheDocument()
    expect(screen.getByText('1970-01-01T00:00:01.200Z')).toBeInTheDocument()

    expect(screen.getByText('Updated')).toBeInTheDocument()
    expect(screen.getByText('1970-01-01T00:00:01.235Z')).toBeInTheDocument()

    expect(screen.getByText('Output')).toBeInTheDocument()
    expect(screen.getByText('test output')).toBeInTheDocument()

    expect(screen.getByText('Parameters')).toBeInTheDocument()
  })

  test('refetches page contents when REQUEST_COMPLETED event occurs and requestId matches', async () => {
    const mockId = '1234'
    const mockInProgressResponse = Object.assign({}, TRequest, { status: 'IN PROGRESS' })

    jest.spyOn(Router, 'useParams').mockReturnValue({ id: mockId })
    jest
    .spyOn(useAxios, 'default')
    .mockReturnValue([
        { data: mockInProgressResponse, loading: false, error: null },
        jest.fn(),
        jest.fn(),
      ])

    render(
      <AllProviders>
        <RequestView />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText('Request View')).toBeInTheDocument()
    })

    expect(screen.getByText(mockId)).toBeInTheDocument()
    expect(screen.getByText('remake request')).toBeInTheDocument()

    expect(screen.getByText('Command')).toBeInTheDocument()
    expect(screen.getByText('test command')).toBeInTheDocument()

    expect(screen.getByText('Namespace')).toBeInTheDocument()
    expect(screen.getByText('test namespace')).toBeInTheDocument()

    expect(screen.getByText('System')).toBeInTheDocument()
    expect(screen.getByText('test system')).toBeInTheDocument()

    expect(screen.getByText('Version')).toBeInTheDocument()
    expect(screen.getByText('test version')).toBeInTheDocument()

    expect(screen.getByText('Instance')).toBeInTheDocument()
    expect(screen.getByText('test instance')).toBeInTheDocument()

    // should be in progress
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.queryByText('SUCCESS')).not.toBeInTheDocument()
    expect(screen.getByText('IN PROGRESS')).toBeInTheDocument()

    expect(screen.getByText('Created')).toBeInTheDocument()
    expect(screen.getByText('1970-01-01T00:00:01.200Z')).toBeInTheDocument()

    expect(screen.getByText('Updated')).toBeInTheDocument()
    expect(screen.getByText('1970-01-01T00:00:01.235Z')).toBeInTheDocument()

    expect(screen.getByText('Output')).toBeInTheDocument()
    expect(screen.queryByText('test output')).not.toBeInTheDocument()

    expect(screen.getByText('Parameters')).toBeInTheDocument()

    // send request completed event
    const mockEvent = {
      name: 'REQUEST_COMPLETED',
      payload:  TRequest,
    }

    const mockMessage = JSON.stringify(mockEvent)
    server.send(mockMessage)

    await waitFor(() => {
      expect(screen.queryByText('IN PROGRESS')).not.toBeInTheDocument()
    })

    expect(screen.getByText('SUCCESS')).toBeInTheDocument()
    expect(screen.getByText('test output')).toBeInTheDocument()

  })

  test('does not refetch page contents when REQUEST_COMPLETED event occurs and requestId does not match', async () => {
    const mockId = '1234'
    const mockInProgressResponse = Object.assign({}, TRequest, { status: 'IN PROGRESS' })

    jest.spyOn(Router, 'useParams').mockReturnValue({ id: mockId })
    jest
      .spyOn(useAxios, 'default')
      .mockReturnValue([
        { data: mockInProgressResponse, loading: false, error: null },
        jest.fn(),
        jest.fn(),
      ])

    render(
      <AllProviders>
        <RequestView />
      </AllProviders>,
    )

    await waitFor(() => {
      expect(screen.getByText('Request View')).toBeInTheDocument()
    })
    expect(screen.getByText(mockId)).toBeInTheDocument()
    expect(screen.getByText('remake request')).toBeInTheDocument()

    expect(screen.getByText('Command')).toBeInTheDocument()
    expect(screen.getByText('test command')).toBeInTheDocument()

    expect(screen.getByText('Namespace')).toBeInTheDocument()
    expect(screen.getByText('test namespace')).toBeInTheDocument()

    expect(screen.getByText('System')).toBeInTheDocument()
    expect(screen.getByText('test system')).toBeInTheDocument()

    expect(screen.getByText('Version')).toBeInTheDocument()
    expect(screen.getByText('test version')).toBeInTheDocument()

    expect(screen.getByText('Instance')).toBeInTheDocument()
    expect(screen.getByText('test instance')).toBeInTheDocument()

    // should be in progress
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.queryByText('SUCCESS')).not.toBeInTheDocument()
    expect(screen.getByText('IN PROGRESS')).toBeInTheDocument()

    expect(screen.getByText('Created')).toBeInTheDocument()
    expect(screen.getByText('1970-01-01T00:00:01.200Z')).toBeInTheDocument()

    expect(screen.getByText('Updated')).toBeInTheDocument()
    expect(screen.getByText('1970-01-01T00:00:01.235Z')).toBeInTheDocument()

    expect(screen.getByText('Output')).toBeInTheDocument()
    expect(screen.queryByText('test output')).not.toBeInTheDocument()

    expect(screen.getByText('Parameters')).toBeInTheDocument()


    // send request complete event for different requestid
    const mockEventOther = {
      name: 'REQUEST_COMPLETED',
      payload: Object.assign({}, TRequest, { id: '5678' }),
    }
    const mockMessageOther = JSON.stringify(mockEventOther)
    server.send(mockMessageOther)

    expect(screen.queryByText('SUCCESS')).not.toBeInTheDocument()
    expect(screen.getByText('IN PROGRESS')).toBeInTheDocument()

  })
})
