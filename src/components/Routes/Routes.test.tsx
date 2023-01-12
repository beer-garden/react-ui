import { render, screen, waitFor } from '@testing-library/react'
import Router from 'react-router-dom'
import { mockAxios, regexUsers } from 'test/axios-mock'
import { TSystem } from 'test/system-test-values'
import { TServerAuthConfig } from 'test/test-values'
import {
  LoggedInMemory,
  MemoryProvider,
  SuspendedProviders,
} from 'test/testMocks'
import { TAdmin, TUser } from 'test/user-test-values'

import { Routes } from './Routes'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}))

afterAll(() => {
  jest.unmock('react-router-dom')
  jest.clearAllMocks()
})

describe('Routes basics', () => {
  test('Systems is default page', async () => {
    render(
      <SuspendedProviders>
        <Routes />
      </SuspendedProviders>,
    )
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Systems' }),
      ).toBeInTheDocument()
    })
    expect(
      screen.getByRole('heading', { name: 'Systems' }).textContent,
    ).toEqual('Systems')
  })
})

describe('Routes with auth disabled', () => {
  test('Users', async () => {
    render(
      <MemoryProvider startLocation={['/admin/users']}>
        <Routes />
      </MemoryProvider>,
    )
    await waitFor(() =>
      expect(
        screen.queryByRole('heading', { name: 'User Management' }),
      ).not.toBeInTheDocument(),
    )
  })

  test('Job should be accessible', async () => {
    render(
      <MemoryProvider startLocation={['/jobs']}>
        <Routes />
      </MemoryProvider>,
    )
    await waitFor(() =>
      expect(
        screen.queryByRole('heading', { name: 'Job' }),
      ).not.toBeInTheDocument(),
    )
  })

  test('System Admin should be accessible', async () => {
    render(
      <MemoryProvider startLocation={['/admin/systems']}>
        <Routes />
      </MemoryProvider>,
    )
    await waitFor(() =>
      expect(
        screen.queryByRole('heading', { name: 'Systems Management' }),
      ).not.toBeInTheDocument(),
    )
  })

  test('Garden Admin should be accessible', async () => {
    render(
      <MemoryProvider startLocation={['/admin/gardens']}>
        <Routes />
      </MemoryProvider>,
    )
    await waitFor(() =>
      expect(
        screen.queryByRole('heading', { name: 'Gardens Management' }),
      ).not.toBeInTheDocument(),
    )
  })

  test('Command Blocklist should be accessible', async () => {
    jest
      .spyOn(Router, 'useParams')
      .mockReturnValue({ systemName: TSystem.name })
    render(
      <MemoryProvider startLocation={['/admin/commandblocklist']}>
        <Routes />
      </MemoryProvider>,
    )
    await waitFor(() =>
      expect(
        screen.queryByRole('heading', {
          name: 'Command Publishing Blocklist',
        }),
      ).not.toBeInTheDocument(),
    )
  })

  test('Login should not be accessible', async () => {
    jest
      .spyOn(Router, 'useParams')
      .mockReturnValue({ systemName: TSystem.name })
    render(
      <MemoryProvider startLocation={['/login']}>
        <Routes />
      </MemoryProvider>,
    )
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Systems' }),
      ).toBeInTheDocument()
    })
  })
})

describe('Routes with auth enabled, has access', () => {
  beforeAll(() => {
    mockAxios.onGet('/config').reply(200, TServerAuthConfig)
    mockAxios.onGet(regexUsers).reply(200, TAdmin)
  })
  test.skip('Users', async () => {
    render(
      <LoggedInMemory startLocation={['/admin/users']}>
        <Routes />
      </LoggedInMemory>,
    )
    await waitFor(() =>
      expect(
        screen.queryByRole('heading', { name: 'Systems' }),
      ).not.toBeInTheDocument(),
    )
    expect(
      screen.getByRole('heading', { name: 'User Management' }),
    ).toBeInTheDocument()
  })

  test.skip('Job', async () => {
    render(
      <LoggedInMemory startLocation={['/admin/jobs']}>
        <Routes />
      </LoggedInMemory>,
    )
    await waitFor(() =>
      expect(
        screen.queryByRole('heading', { name: 'Systems' }),
      ).not.toBeInTheDocument(),
    )
    expect(screen.getByRole('heading', { name: 'Job' })).toBeInTheDocument()
  })

  test.skip('System Admin', async () => {
    render(
      <LoggedInMemory startLocation={['/admin/jobs']}>
        <Routes />
      </LoggedInMemory>,
    )
    await waitFor(() =>
      expect(
        screen.queryByRole('heading', { name: 'Systems' }),
      ).not.toBeInTheDocument(),
    )
    expect(
      screen.getByRole('heading', { name: 'Systems Management' }),
    ).toBeInTheDocument()
  })

  test.skip('Garden Admin', async () => {
    render(
      <LoggedInMemory startLocation={['/admin/jobs']}>
        <Routes />
      </LoggedInMemory>,
    )
    await waitFor(() =>
      expect(
        screen.queryByRole('heading', { name: 'Systems' }),
      ).not.toBeInTheDocument(),
    )
    expect(
      screen.getByRole('heading', { name: 'Gardens Management' }),
    ).toBeInTheDocument()
  })

  test.skip('Command Blocklist', async () => {
    render(
      <LoggedInMemory startLocation={['/admin/jobs']}>
        <Routes />
      </LoggedInMemory>,
    )
    await waitFor(() =>
      expect(
        screen.queryByRole('heading', { name: 'Systems' }),
      ).not.toBeInTheDocument(),
    )
    expect(
      screen.getByRole('heading', { name: 'Command Publishing Blocklist' }),
    ).toBeInTheDocument()
  })

  test('Login should be accessible', async () => {
    jest
      .spyOn(Router, 'useParams')
      .mockReturnValue({ systemName: TSystem.name })
    render(
      <MemoryProvider startLocation={['/login']}>
        <Routes />
      </MemoryProvider>,
    )
    await waitFor(() => {
      expect(
        screen.queryByRole('heading', { name: 'Systems' }),
      ).not.toBeInTheDocument()
    })
    expect(
      screen.getByRole('textbox', { name: 'Username' }),
    ).toBeInTheDocument()
  })
})

describe('Routes with auth enabled, no access', () => {
  beforeAll(() => {
    mockAxios.onGet('/config').reply(200, TServerAuthConfig)
    mockAxios.onGet(regexUsers).reply(200, TUser)
  })
  test('Users should not be accessible', async () => {
    render(
      <LoggedInMemory startLocation={['/admin/users']}>
        <Routes />
      </LoggedInMemory>,
    )
    await waitFor(() =>
      expect(
        screen.queryByRole('heading', { name: 'User Management' }),
      ).not.toBeInTheDocument(),
    )
    expect(
      screen.getByRole('textbox', { name: 'Username' }),
    ).toBeInTheDocument()
  })

  test('Job should not be accessible', async () => {
    render(
      <LoggedInMemory startLocation={['/jobs']}>
        <Routes />
      </LoggedInMemory>,
    )
    await waitFor(() =>
      expect(
        screen.queryByRole('heading', { name: 'Job' }),
      ).not.toBeInTheDocument(),
    )
    expect(
      screen.getByRole('textbox', { name: 'Username' }),
    ).toBeInTheDocument()
  })

  test('System Admin should not be accessible', async () => {
    render(
      <LoggedInMemory startLocation={['/admin/systems']}>
        <Routes />
      </LoggedInMemory>,
    )
    await waitFor(() =>
      expect(
        screen.queryByRole('heading', { name: 'Systems Management' }),
      ).not.toBeInTheDocument(),
    )
    expect(
      screen.getByRole('textbox', { name: 'Username' }),
    ).toBeInTheDocument()
  })

  test('Garden Admin should not be accessible', async () => {
    render(
      <LoggedInMemory startLocation={['/admin/gardens']}>
        <Routes />
      </LoggedInMemory>,
    )
    await waitFor(() =>
      expect(
        screen.queryByRole('heading', { name: 'Gardens Management' }),
      ).not.toBeInTheDocument(),
    )
    expect(
      screen.getByRole('textbox', { name: 'Username' }),
    ).toBeInTheDocument()
  })

  test('Command Blocklist should not be accessible', async () => {
    jest
      .spyOn(Router, 'useParams')
      .mockReturnValue({ systemName: TSystem.name })
    render(
      <LoggedInMemory startLocation={['/admin/commandblocklist']}>
        <Routes />
      </LoggedInMemory>,
    )
    await waitFor(() =>
      expect(
        screen.queryByRole('heading', {
          name: 'Command Publishing Blocklist',
        }),
      ).not.toBeInTheDocument(),
    )
    expect(
      screen.getByRole('textbox', { name: 'Username' }),
    ).toBeInTheDocument()
  })
})
