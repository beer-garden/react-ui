import { render, screen } from '@testing-library/react'
import { ColumnInstance } from 'react-table'
import { TColumn } from 'test/table-test-values'
import { ObjectWithStringKeys } from 'types/custom-types'

import { InlineFilter } from './InlineFilter'

describe('InlineFilter', () => {
  test('renders cell filter', () => {
    const testProps = {
      column: TColumn as ColumnInstance<ObjectWithStringKeys>,
    }
    render(<InlineFilter {...testProps} />)
    expect(screen.getByText('Filter')).toBeInTheDocument()
  })
})
