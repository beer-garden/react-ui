import { render, screen, waitFor, within } from '@testing-library/react'
import { mockAxios } from 'test/axios-mock'
import { TSystem } from 'test/system-test-values'
import { AllProviders } from 'test/testMocks'

import { SystemsIndex } from './SystemIndex'

describe('SystemIndex', () => {
  test('renders SystemIndex page with contents', async () => {
    render(
      <AllProviders>
        <SystemsIndex />
      </AllProviders>,
    )

    await waitFor(() => {
      expect(screen.getByText('Systems')).toBeInTheDocument()
    })

    expect(screen.getByRole('table')).toBeInTheDocument()
    const table = screen.getByRole('table')

    const rows = within(table).getAllByRole('row')
    // header, filter, data
    expect(rows.length).toEqual(3)

    const headerRow = rows[0]
    expect(within(headerRow).getByText('Namespace')).toBeInTheDocument()
    expect(within(headerRow).getByText('System')).toBeInTheDocument()
    expect(within(headerRow).getByText('Version')).toBeInTheDocument()
    expect(within(headerRow).getByText('Description')).toBeInTheDocument()
    expect(within(headerRow).getByText('Commands')).toBeInTheDocument()
    expect(within(headerRow).getByText('Instances')).toBeInTheDocument()

    const dataRow = rows[2]
    expect(within(dataRow).getByText('test')).toBeInTheDocument()
    expect(within(dataRow).getByText('testSystem')).toBeInTheDocument()
    expect(within(dataRow).getByText('1.0.0')).toBeInTheDocument()
    expect(within(dataRow).getByText('testing a system')).toBeInTheDocument()
    const oneCells = within(dataRow).getAllByText(1)
    expect(oneCells.length).toEqual(2)
    expect(within(dataRow).getByText('Explore')).toBeInTheDocument()
  })

  test('Alert is shown on error from getSystems()', async () => {
    mockAxios.onGet('/api/v1/systems').reply(404)

    render(
      <AllProviders>
        <SystemsIndex />
      </AllProviders>,
    )

    await waitFor(() => {
      expect(screen.getByText('Systems')).toBeInTheDocument()
    })

    const errorMessage = 'ERROR: Error: Request failed with status code 404'
    expect(screen.getByText(errorMessage)).toBeInTheDocument()

    mockAxios.onGet('/api/v1/systems').reply(200, [TSystem])
  })
})
