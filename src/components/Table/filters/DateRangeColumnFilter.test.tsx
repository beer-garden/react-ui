import { render, screen } from '@testing-library/react'
import { FilterProps } from 'react-table'
import { TDateFilter } from 'test/table-test-values'
import { ObjectWithStringKeys } from 'types/custom-types'

import { DateRangeColumnFilter } from './DateRangeColumnFilter'

describe('DateRangeColumnFilter', () => {
  test('renders cell string value', () => {
    const testProps = {
      column: TDateFilter,
    } as FilterProps<ObjectWithStringKeys>
    render(<DateRangeColumnFilter {...testProps} />)
    expect(screen.getByDisplayValue('2022-10-14T16:01')).toBeInTheDocument()
    expect(screen.getByDisplayValue('2022-11-24T16:02')).toBeInTheDocument()
  })
})
