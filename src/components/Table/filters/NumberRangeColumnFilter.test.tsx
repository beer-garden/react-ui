import { render, screen } from '@testing-library/react'
import { FilterProps } from 'react-table'
import { TNumberFilter } from 'test/table-test-values'
import { ObjectWithStringKeys } from 'types/custom-types'

import { NumberRangeColumnFilter } from './NumberRangeColumnFilter'

describe('NumberRangeColumnFilter', () => {
  test('renders cell number value', () => {
    const testProps = {
      column: TNumberFilter,
    } as FilterProps<ObjectWithStringKeys>
    render(<NumberRangeColumnFilter {...testProps} />)
    expect(
      screen.getByDisplayValue(TNumberFilter.filterValue[0]),
    ).toBeInTheDocument()
    expect(
      screen.getByDisplayValue(TNumberFilter.filterValue[1]),
    ).toBeInTheDocument()
  })
})
