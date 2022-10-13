import { render, screen, within } from '@testing-library/react'
import { TGardenSync } from 'test/garden-test-values'
import { AllProviders } from 'test/testMocks'

import { GardenSyncTable } from './GardenSyncTable'

describe('Garden Sync Table', () => {
  test('render table of sync status', () => {
    render(
      <AllProviders>
        <GardenSyncTable syncObj={TGardenSync} />
      </AllProviders>,
    )
    expect(
      screen.getByRole('heading', { name: 'Sync Status' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('table')).toBeInTheDocument()
    Object.keys(TGardenSync).forEach((gardenName) => {
      expect(screen.getByRole('row', { name: gardenName })).toBeInTheDocument()
    })
  })

  test('check mark for synced', () => {
    render(
      <AllProviders>
        <GardenSyncTable syncObj={TGardenSync} />
      </AllProviders>,
    )
    const tableData = screen.getByRole('row', { name: 'gardenOne' })
    expect(within(tableData).getByTestId('CheckIcon')).toBeInTheDocument()
    expect(within(tableData).queryByTestId('CloseIcon')).not.toBeInTheDocument()
  })

  test('X mark for not synced', () => {
    render(
      <AllProviders>
        <GardenSyncTable syncObj={TGardenSync} />
      </AllProviders>,
    )
    const tableData = screen.getByRole('row', { name: 'gardenTwo' })
    expect(within(tableData).getByTestId('CloseIcon')).toBeInTheDocument()
    expect(within(tableData).queryByTestId('CheckIcon')).not.toBeInTheDocument()
  })
})
