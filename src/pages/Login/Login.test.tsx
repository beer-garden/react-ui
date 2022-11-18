import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { mockAxios } from 'test/axios-mock'
import { AllProviders } from 'test/testMocks'

import { Login } from './Login'

const mockedUsedNavigate = jest.fn()

jest.mock('hooks/useToken', () => ({
  ...jest.requireActual('hooks/useToken'),
  useToken: () => {
    return { setToken: jest.fn() }
  },
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}))

describe('Login', () => {
  afterAll(() => {
    jest.unmock('hooks/useToken')
    jest.unmock('react-router-dom')
    jest.clearAllMocks()
  })

  test('renders input areas', async () => {
    render(
      <AllProviders>
        <Login />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByLabelText('Password *')).toBeInTheDocument()
    })
    expect(screen.getByLabelText('Username *')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
  })

  test('accepts user login', async () => {
    render(
      <AllProviders>
        <Login />
      </AllProviders>,
    )
    fireEvent.change(screen.getByRole('textbox', { name: 'Username' }), {
      target: { value: 'testUser' },
    })
    fireEvent.change(screen.getByLabelText('Password *'), {
      target: { value: 'goodPW' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    await waitFor(() => {
      expect(
        screen.queryByText(
          'Authentication Failed: please enter correct username and password',
        ),
      ).not.toBeInTheDocument()
    })
    expect(mockedUsedNavigate).toHaveBeenCalled()
  })

  test('alerts on bad credentials', async () => {
    mockAxios.onPost('/api/v1/token').reply(404, { message: 'Auth fail' })
    render(
      <AllProviders>
        <Login />
      </AllProviders>,
    )
    fireEvent.change(screen.getByRole('textbox', { name: 'Username' }), {
      target: { value: 'testUser' },
    })
    fireEvent.change(screen.getByLabelText('Password *'), {
      target: { value: 'badPW' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    expect(screen.getByLabelText('Password *')).toBeInTheDocument()
    expect(screen.getByLabelText('Username *')).toBeInTheDocument()
    await waitFor(() => {
      expect(
        screen.getByText(
          'Auth fail: please enter correct username and password',
        ),
      ).toBeInTheDocument()
    })
    expect(mockedUsedNavigate).not.toHaveBeenCalled()
    mockAxios
      .onPost('/api/v1/token')
      .reply(200, { access: 'admin', refresh: 'none' })
  })
})
