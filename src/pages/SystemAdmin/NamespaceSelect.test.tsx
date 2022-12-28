import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NamespacesSelectedContext } from 'pages/SystemAdmin'
import { mockAxios } from 'test/axios-mock'
import { AllProviders } from 'test/testMocks'

import { NamespaceSelect } from './NamespaceSelect'

const context = {
  namespaces: ['test', 'second', 'other'],
  namespacesSelected: [],
  setNamespacesSelected: jest.fn(),
}

describe('NamespaceSelect', () => {
  test('renders dropdown select', async () => {
    render(
      <AllProviders>
        <NamespacesSelectedContext.Provider value={context}>
          <NamespaceSelect />
        </NamespacesSelectedContext.Provider>
      </AllProviders>,
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
    render(
      <AllProviders>
        <NamespacesSelectedContext.Provider value={context}>
          <NamespaceSelect />
        </NamespacesSelectedContext.Provider>
      </AllProviders>,
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
})
