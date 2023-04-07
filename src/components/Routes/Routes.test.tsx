import { render, screen, waitFor } from '@testing-library/react'
import Router from 'react-router-dom'
import { mockAxios, regexUsers } from 'test/axios-mock'
import { TSystem } from 'test/system-test-values'
import { TServerAuthConfig, TServerConfig } from 'test/test-values'
import { loginFN, MemoryProvider, SuspendedProviders } from 'test/testMocks'
import { TAdmin, TUser } from 'test/user-test-values'

import { Routes } from './Routes'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}))

jest.mock('jwt-decode', () => () => ({
  ...jest.requireActual('jwt-decode'),
  exp: 9999912345,
}))

describe('Routes', () => {
  afterAll(() => {
    jest.unmock('react-router-dom')
    jest.unmock('jwt-decode')
    jest.clearAllMocks()
  })

  test('Systems is default page', async () => {
    render(
      <SuspendedProviders>
        <Routes />
      </SuspendedProviders>,
    )
    await waitFor(
      () => {
        expect(
          screen.getByRole('heading', { name: 'Systems' }),
        ).toBeInTheDocument()
      },
      { timeout: 2500 },
    )
    expect(
      screen.getByRole('heading', { name: 'Systems' }).textContent,
    ).toEqual('Systems')
  })

  describe('auth disabled', () => {
    beforeAll(() => {
      mockAxios.onGet('/config').reply(200, TServerConfig)
      mockAxios.onGet(regexUsers).reply(200, TAdmin)
    })

    test('Systems should be accessible', async () => {
      render(
        <MemoryProvider startLocation={['/systems']}>
          <Routes />
        </MemoryProvider>,
      )
      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Systems' }),
        ).toBeInTheDocument()
      })
    })

    test('Requests should be accessible', async () => {
      render(
        <MemoryProvider startLocation={['/requests']}>
          <Routes />
        </MemoryProvider>,
      )
      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Requests' }),
        ).toBeInTheDocument()
      })
    })

    test('Users should not be accessible', async () => {
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
      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Systems' }),
        ).toBeInTheDocument()
      })
    })

    test('Job should be accessible', async () => {
      render(
        <MemoryProvider startLocation={['/jobs']}>
          <Routes />
        </MemoryProvider>,
      )
      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Request Scheduler' }),
        ).toBeInTheDocument()
      })
    })

    test('System Admin should be accessible', async () => {
      render(
        <MemoryProvider startLocation={['/admin/systems']}>
          <Routes />
        </MemoryProvider>,
      )
      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Systems Management' }),
        ).toBeInTheDocument()
      })
    })

    test('Garden Admin should be accessible', async () => {
      render(
        <MemoryProvider startLocation={['/admin/gardens']}>
          <Routes />
        </MemoryProvider>,
      )
      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Gardens Management' }),
        ).toBeInTheDocument()
      })
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
      await waitFor(() => {
        expect(
          screen.getByRole('heading', {
            name: 'Command Publishing Blocklist',
          }),
        ).toBeInTheDocument()
      })
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

  describe('auth enabled, no access', () => {
    beforeAll(() => {
      mockAxios.onGet('/config').reply(200, TServerAuthConfig)
      mockAxios.onGet(regexUsers).reply(200, TUser)
    })

    afterAll(() => {
      mockAxios.onGet('/config').reply(200, TServerConfig)
    })

    test('Logging in', async () => {
      render(
        <MemoryProvider startLocation={['/systems']}>
          <Routes />
        </MemoryProvider>,
      )
      await waitFor(() => {
        expect(screen.getByLabelText('Password *')).toBeInTheDocument()
      })
      // For some reason have to do this only once
      loginFN()
    })

    test('Systems should be accessible', async () => {
      render(
        <MemoryProvider startLocation={['/systems']}>
          <Routes />
        </MemoryProvider>,
      )
      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Systems' }),
        ).toBeInTheDocument()
      })
    })

    test('Requests should be accessible', async () => {
      render(
        <MemoryProvider startLocation={['/requests']}>
          <Routes />
        </MemoryProvider>,
      )
      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Requests' }),
        ).toBeInTheDocument()
      })
    })

    test('Users should not be accessible', async () => {
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
      expect(
        screen.getByRole('heading', { name: 'Systems' }),
      ).toBeInTheDocument()
    })

    test('Job should not be accessible', async () => {
      render(
        <MemoryProvider startLocation={['/jobs']}>
          <Routes />
        </MemoryProvider>,
      )
      await waitFor(() =>
        expect(
          screen.queryByRole('heading', { name: 'Request Scheduler' }),
        ).not.toBeInTheDocument(),
      )
      expect(
        screen.getByRole('heading', { name: 'Systems' }),
      ).toBeInTheDocument()
    })

    test('System Admin should not be accessible', async () => {
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
      expect(
        screen.getByRole('heading', { name: 'Systems' }),
      ).toBeInTheDocument()
    })

    test('Garden Admin should not be accessible', async () => {
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
      expect(
        screen.getByRole('heading', { name: 'Systems' }),
      ).toBeInTheDocument()
    })

    test('Command Blocklist should not be accessible', async () => {
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
      expect(
        screen.getByRole('heading', { name: 'Systems' }),
      ).toBeInTheDocument()
    })
  })

  describe('auth enabled, has access', () => {
    beforeAll(() => {
      mockAxios.onGet('/config').reply(200, TServerAuthConfig)
      mockAxios.onGet(regexUsers).reply(200, TAdmin)
    })

    afterAll(() => {
      mockAxios.onGet('/config').reply(200, TServerConfig)
    })

    test('Systems', async () => {
      render(
        <MemoryProvider startLocation={['/systems']}>
          <Routes />
        </MemoryProvider>,
      )
      // For some reason still logged in from previous suite
      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Systems' }),
        ).toBeInTheDocument()
      })
    })

    test('Requests', async () => {
      render(
        <MemoryProvider startLocation={['/requests']}>
          <Routes />
        </MemoryProvider>,
      )
      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Requests' }),
        ).toBeInTheDocument()
      })
      expect(
        screen.queryByRole('heading', { name: 'Systems' }),
      ).not.toBeInTheDocument()
    })

    test('Users', async () => {
      render(
        <MemoryProvider startLocation={['/admin/users']}>
          <Routes />
        </MemoryProvider>,
      )
      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'User Management' }),
        ).toBeInTheDocument()
      })
      expect(
        screen.queryByRole('heading', { name: 'Systems' }),
      ).not.toBeInTheDocument()
    })

    test('Job', async () => {
      render(
        <MemoryProvider startLocation={['/jobs']}>
          <Routes />
        </MemoryProvider>,
      )
      await waitFor(() =>
        expect(
          screen.queryByRole('heading', { name: 'Systems' }),
        ).not.toBeInTheDocument(),
      )
      expect(
        screen.getByRole('heading', { name: 'Request Scheduler' }),
      ).toBeInTheDocument()
    })

    test('System Admin', async () => {
      render(
        <MemoryProvider startLocation={['/admin/systems']}>
          <Routes />
        </MemoryProvider>,
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

    test('Garden Admin', async () => {
      render(
        <MemoryProvider startLocation={['/admin/gardens']}>
          <Routes />
        </MemoryProvider>,
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

    test('Command Blocklist', async () => {
      render(
        <MemoryProvider startLocation={['/admin/commandblocklist']}>
          <Routes />
        </MemoryProvider>,
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
})
