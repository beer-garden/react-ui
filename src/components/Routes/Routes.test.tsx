import { render, screen, waitFor } from '@testing-library/react'
import Router from 'react-router-dom'
import { mockAxios, regexUsers } from 'test/axios-mock'
import { TServerAuthConfig, TSystem } from 'test/test-values'
import {
  LoggedInMemory,
  MemoryProvider,
  SuspendedProviders,
} from 'test/testMocks'
import { TAdmin } from 'test/user-test-values'

import { Routes } from './Routes'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}))

jest.mock('pages/JobIndex/jobIndexHelpers', () => ({
  getFormattedTable: jest.fn(),
}))

describe('Routes', () => {
  afterAll(() => {
    jest.unmock('react-router-dom')
    jest.unmock('pages/JobIndex/jobIndexHelpers')
    jest.clearAllMocks()
  })

  test('Systems is default page', async () => {
    render(
      <SuspendedProviders>
        <Routes />
      </SuspendedProviders>,
    )
    const header = await screen.findByRole('heading', { name: 'Systems' })
    expect(header).toBeInTheDocument()
    expect(header.textContent).toEqual('Systems')
  })

  describe('auth not enabled', () => {
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

    test('Job', async () => {
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

    test('System Admin', async () => {
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

    test('Garden Admin', async () => {
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

    test('Command Blocklist', async () => {
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
  })

  describe('auth enabled', () => {
    beforeAll(() => {
      mockAxios.onGet('/config').reply(200, TServerAuthConfig)
    })

    describe('does not have access', () => {
      // test('Users', async () => {
      //   render(
      //     <LoggedInMemory startLocation={['/admin/users']}>
      //       <Routes />
      //     </LoggedInMemory>,
      //   )
      //   await waitFor(() =>
      //     expect(
      //       screen.queryByRole('heading', { name: 'User Management' }),
      //     ).not.toBeInTheDocument(),
      //   )
      //   expect(
      //     screen.getByRole('heading', { name: 'Systems' }),
      //   ).toBeInTheDocument()
      // })

      test('Job', async () => {
        render(
          <LoggedInMemory startLocation={['/admin/jobs']}>
            <Routes />
          </LoggedInMemory>,
        )
        await waitFor(() =>
          expect(
            screen.queryByRole('heading', { name: 'Job' }),
          ).not.toBeInTheDocument(),
        )
        expect(
          screen.getByRole('heading', { name: 'Systems' }),
        ).toBeInTheDocument()
      })

      test('System Admin', async () => {
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
          screen.getByRole('heading', { name: 'Systems' }),
        ).toBeInTheDocument()
      })

      test('Garden Admin', async () => {
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
          screen.getByRole('heading', { name: 'Systems' }),
        ).toBeInTheDocument()
      })

      test('Command Blocklist', async () => {
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
          screen.getByRole('heading', { name: 'Systems' }),
        ).toBeInTheDocument()
      })
    })

    describe('has access', () => {
      beforeAll(() => {
        mockAxios.onGet(regexUsers).reply(200, TAdmin)
      })

      /** TODO: you get dumped at system page automatically after login,
       * cannot fireEvent click to get to Users page because nav bar is not rendered
       */
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
    })
  })
})
