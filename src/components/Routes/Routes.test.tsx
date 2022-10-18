import { render, screen, waitFor } from '@testing-library/react'
import { mockAxios, regexUsers } from 'test/axios-mock'
import { TServerAuthConfig } from 'test/test-values'
import {
  LoggedInMemory,
  MemoryProvider,
  SuspendedProviders,
} from 'test/testMocks'
import { TAdmin } from 'test/user-test-values'

import { Routes } from './Routes'

describe('Routes', () => {
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
  })

  describe('auth enabled', () => {
    beforeAll(() => {
      mockAxios.onGet('/config').reply(200, TServerAuthConfig)
    })

    describe('does not have access', () => {
      test('Users', async () => {
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
          screen.getByRole('heading', { name: 'Systems' }),
        ).toBeInTheDocument()
      })
    })

    describe('has access', () => {
      beforeAll(() => {
        mockAxios.onGet(regexUsers).reply(200, TAdmin)
      })

      test.skip('Users', async () => {
        render(
          <LoggedInMemory startLocation={['/admin/users']}>
            <Routes />
          </LoggedInMemory>,
        )
        /** TODO: you get dumped at system page automatically after login,
         * cannot fireEvent click to get to Users page because nav bar is not rendered
         */
        await waitFor(() =>
          expect(
            screen.queryByRole('heading', { name: 'Systems' }),
          ).not.toBeInTheDocument(),
        )
        expect(
          screen.getByRole('heading', { name: 'User Management' }),
        ).toBeInTheDocument()
      })
    })
  })
})
