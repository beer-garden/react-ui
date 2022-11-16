import { render, screen } from '@testing-library/react'
import { FilterProps } from 'react-table'
import { TFilter } from 'test/table-test-values'
import { ObjectWithStringKeys } from 'types/custom-types'

import { TextFilter } from './TextFilter'

describe('TextFilter', () => {
  test('renders cell string value', () => {
    const testProps = { column: TFilter } as FilterProps<ObjectWithStringKeys>
    render(<TextFilter {...testProps} />)
    expect(screen.getByDisplayValue(TFilter.filterValue)).toBeInTheDocument()
  })
})
