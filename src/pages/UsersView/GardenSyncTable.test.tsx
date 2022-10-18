import { render, screen, waitFor, within } from '@testing-library/react'
import { TGardenSync } from 'test/garden-test-values'
import { AllProviders } from 'test/testMocks'

import { GardenSyncTable } from './GardenSyncTable'

describe('Garden Sync Table', () => {
  test('render table of sync status', async () => {
    render(
      <AllProviders>
        <GardenSyncTable syncObj={TGardenSync} />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Sync Status' }),
      ).toBeInTheDocument()
    })
    expect(screen.getByRole('table')).toBeInTheDocument()
    Object.keys(TGardenSync).forEach((gardenName) => {
      expect(screen.getByRole('row', { name: gardenName })).toBeInTheDocument()
    })
  })

  test('check mark for synced', async () => {
    render(
      <AllProviders>
        <GardenSyncTable syncObj={TGardenSync} />
      </AllProviders>,
    )
    const tableData = screen.getByRole('row', { name: 'gardenOne' })
    await waitFor(() => {
      expect(within(tableData).getByTestId('CheckIcon')).toBeInTheDocument()
    })
    expect(within(tableData).queryByTestId('CloseIcon')).not.toBeInTheDocument()
  })

  test('X mark for not synced', async () => {
    render(
      <AllProviders>
        <GardenSyncTable syncObj={TGardenSync} />
      </AllProviders>,
    )
    const tableData = screen.getByRole('row', { name: 'gardenTwo' })
    await waitFor(() => {
      expect(within(tableData).getByTestId('CloseIcon')).toBeInTheDocument()
    })
    expect(within(tableData).queryByTestId('CheckIcon')).not.toBeInTheDocument()
  })
})
