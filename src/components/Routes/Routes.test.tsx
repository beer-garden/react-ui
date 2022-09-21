import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { mockAxios } from 'test/axios-mock'
import { TServerConfig } from 'test/test-values'
import { SuspendedProviders } from 'test/testMocks'

import { Routes } from './Routes'

describe('Routes', () => {
  test('Systems is default page', async () => {
    render(
      <SuspendedProviders>
        <Routes />
      </SuspendedProviders>,
    )
    const header = await screen.findByRole('heading')
    expect(header).toBeInTheDocument()
    expect(header.textContent).toEqual('Systems')
  })
})
