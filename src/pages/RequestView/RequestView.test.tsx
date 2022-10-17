import { render, screen, waitFor } from '@testing-library/react'
import * as useAxios from 'axios-hooks'
import WS from 'jest-websocket-mock'
import Router from 'react-router-dom'
import { TRequest } from 'test/test-values'
import { AllProviders } from 'test/testMocks'

import { RequestView } from './RequestView'
jest.mock('./RequestViewTable', () => ({
  RequestViewTable: () => {
    const MockTable = <div data-testid="request-view-table" />
    return MockTable
  },
}))

jest.mock('./RequestViewOutput', () => ({
  RequestViewOutput: () => {
    const MockOutput = <div data-testid="request-view-output" />
    return MockOutput
  },
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}))

jest.mock('axios-hooks', () => ({
  ...jest.requireActual('axios-hooks'),
  useAxios: jest.fn(),
}))

describe('RequestView', () => {
  let server: WS

  beforeEach(() => {
    server = new WS('ws://localhost:2337/api/v1/socket/events')
  })

  afterEach(() => {
    WS.clean()
  })

  afterAll(() => {
    jest.unmock('./RequestViewTable')
    jest.unmock('./RequestViewOutput')
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
    expect(screen.getByTestId('request-view-table')).toBeInTheDocument()
    expect(screen.getByTestId('request-view-output')).toBeInTheDocument()
    expect(screen.getByText('Parameters')).toBeInTheDocument()
  })

  test('refetches page contents when REQUEST_COMPLETED event occurs and requestId matches', async () => {
    const mockId = '1234'
    const mockFetch = jest.fn()
    const mockInProgressResponse = Object.assign({}, TRequest, { status: 'IN PROGRESS' })

    jest.spyOn(Router, 'useParams').mockReturnValue({ id: mockId })
    jest
      .spyOn(useAxios, 'default')
      .mockReturnValue([
        { data: mockInProgressResponse, loading: false, error: null },
        mockFetch,
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
    expect(screen.getByTestId('request-view-table')).toBeInTheDocument()
    expect(screen.getByTestId('request-view-output')).toBeInTheDocument()
    expect(screen.getByText('Parameters')).toBeInTheDocument()

    // send request completed event
    const mockEvent = {
      name: 'REQUEST_COMPLETED',
      payload:  TRequest,
    }

    const mockMessage = JSON.stringify(mockEvent)
    server.send(mockMessage)

    expect(mockFetch).toBeCalledTimes(1)
  })

  test('does not refetch page contents when REQUEST_COMPLETED event occurs and requestId does not match', async () => {
    const mockId = '1234'
    const mockFetch = jest.fn()

    jest.spyOn(Router, 'useParams').mockReturnValue({ id: mockId })
    jest
      .spyOn(useAxios, 'default')
      .mockReturnValue([
        { data: TRequest, loading: false, error: null },
        mockFetch,
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
    expect(screen.getByTestId('request-view-table')).toBeInTheDocument()
    expect(screen.getByTestId('request-view-output')).toBeInTheDocument()
    expect(screen.getByText('Parameters')).toBeInTheDocument()

    // send request complete event for different requestid
    const mockEventOther = {
      name: 'REQUEST_COMPLETED',
      payload: Object.assign({}, TRequest, { id: '5678' }),
    }
    const mockMessageOther = JSON.stringify(mockEventOther)
    server.send(mockMessageOther)

    expect(mockFetch).not.toHaveBeenCalled()
  })
})
