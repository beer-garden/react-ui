import { render, screen } from '@testing-library/react'
import { FilterProps } from 'react-table'
import { TDateFilter } from 'test/table-test-values'
import { ObjectWithStringKeys } from 'types/custom-types'

import { DateRangeColumnFilter } from './DateRangeColumnFilter'

const dateTranslator = (dateString: string) => {
  // this abomination is the best I could come up with without bringing
  // in a library, which would be pointless
  return (
    new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }).format(new Date(dateString)) +
    'T' +
    new Intl.DateTimeFormat('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }).format(new Date(dateString))
  )
}

describe('DateRangeColumnFilter', () => {
  test('renders cell string value', () => {
    const [from, to] = TDateFilter.filterValue.map(dateTranslator)
    const testProps = {
      column: TDateFilter,
    } as FilterProps<ObjectWithStringKeys>

    render(<DateRangeColumnFilter {...testProps} />)

    expect(screen.getByDisplayValue(from)).toBeInTheDocument()
    expect(screen.getByDisplayValue(to)).toBeInTheDocument()
  })
})
