import { render, screen } from '@testing-library/react'
import { SuspendedProviders } from 'test/testMocks'

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
})
