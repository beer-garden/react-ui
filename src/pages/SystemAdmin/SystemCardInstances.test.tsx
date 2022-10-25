import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { TInstance, TInstance2 } from 'test/test-values'
import { AllProviders } from 'test/testMocks'

import SystemCardInstances from './SystemCardInstances'

describe('SystemCard actions', () => {
  test('renders a menu button per instance', async () => {
    render(
      <AllProviders>
        <SystemCardInstances
          instances={[TInstance, TInstance2]}
          fileHeader={'TestNamespace'}
        />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText('testInstance')).toBeInTheDocument()
    })
    expect(screen.getByText('secondInstance')).toBeInTheDocument()
  })

  test('opens queue modal', async () => {
    render(
      <AllProviders>
        <SystemCardInstances
          instances={[TInstance]}
          fileHeader={'TestNamespace'}
        />
      </AllProviders>,
    )
    fireEvent.click(screen.getByText('testInstance'))
    fireEvent.click(screen.getByText('Manage Queue'))
    expect(await screen.findByText(/Queue Manager:/)).toBeInTheDocument()
  })

  test('opens log modal', async () => {
    render(
      <AllProviders>
        <SystemCardInstances
          instances={[TInstance]}
          fileHeader={'TestNamespace'}
        />
      </AllProviders>,
    )
    fireEvent.click(screen.getByText('testInstance'))
    fireEvent.click(screen.getByText('Show Logs'))
    expect(await screen.findByText(/Logs for/)).toBeInTheDocument()
  })
})
