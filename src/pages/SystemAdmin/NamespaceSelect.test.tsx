import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { mockAxios } from 'test/axios-mock'
import { LoggedInProviders } from 'test/testMocks'

import { NamespaceSelect } from './NamespaceSelect'

describe('NamespaceSelect', () => {
  test('renders dropdown select', async () => {
    render(
      <LoggedInProviders>
        <NamespaceSelect />
      </LoggedInProviders>,
    )
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Namespaces:' }),
      ).toBeInTheDocument()
    })
    expect(screen.getByRole('button', { name: 'Namespaces:' })).toHaveClass(
      'MuiSelect-select',
    )
  })

  test('renders list of namespaces to select from', async () => {
    mockAxios
      .onGet('/api/v1/namespaces')
      .reply(200, ['test', 'second', 'other'])
    render(
      <LoggedInProviders>
        <NamespaceSelect />
      </LoggedInProviders>,
    )
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Namespaces:' }),
      ).toBeInTheDocument()
    })
    const selectEl = await screen.findByLabelText('Namespaces:')
    expect(selectEl).toBeInTheDocument()
    userEvent.click(selectEl)
    // Locate the corresponding popup (`listbox`) of options
    const optionsPopupEl = await screen.findByRole('listbox', {
      name: 'Namespaces:',
    })
    expect(within(optionsPopupEl).getByText('test')).toBeInTheDocument()
    expect(within(optionsPopupEl).getByText('second')).toBeInTheDocument()
    expect(within(optionsPopupEl).getByText('other')).toBeInTheDocument()
    mockAxios.onGet('/api/v1/namespaces').reply(200, ['test'])
  })

  test('Alert is shown on error from getNamespaces()', async () => {
    const errorMessage = 'Failure to return namespaces'
    mockAxios.onGet('/api/v1/namespaces').reply(404, { message: errorMessage })
    render(
      <LoggedInProviders>
        <NamespaceSelect />
      </LoggedInProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText(`ERROR: ${errorMessage}`)).toBeInTheDocument()
    })
    mockAxios.onGet('/api/v1/namespaces').reply(200, ['test'])
  })
})
