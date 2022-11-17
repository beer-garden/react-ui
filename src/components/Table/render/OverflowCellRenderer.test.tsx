import { render, screen } from '@testing-library/react'
import { CellProps } from 'react-table'
import { TCell } from 'test/table-test-values'
import { ObjectWithStringKeys } from 'types/custom-types'

import { OverflowCellRenderer } from './OverflowCellRenderer'

describe('OverflowCellRenderer', () => {
  test('renders cell string value', () => {
    render(
      OverflowCellRenderer({ cell: TCell } as CellProps<ObjectWithStringKeys>),
    )
    expect(screen.getByText(TCell.value)).toBeInTheDocument()
  })
})
