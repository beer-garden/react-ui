import { render, screen } from '@testing-library/react'
import { FilterProps } from 'react-table'
import { TSelectFilter } from 'test/table-test-values'
import { ObjectWithStringKeys } from 'types/custom-types'

import { SelectionColumnFilter } from './SelectionColumnFilter'

describe('SelectionColumnFilter', () => {
  test('renders cell select value', () => {
    const testProps = {
      column: TSelectFilter,
    } as FilterProps<ObjectWithStringKeys>
    render(<SelectionColumnFilter {...testProps} />)
    expect(
      screen.getByDisplayValue(TSelectFilter.filterValue),
    ).toBeInTheDocument()
  })
})
