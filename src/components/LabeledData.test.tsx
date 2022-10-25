import { render, screen } from '@testing-library/react'
import { HashRouter } from 'react-router-dom'

import { LabeledData } from './LabeledData'

describe('Labeled Data Component', () => {
  test('renders title and value', () => {
    render(
      <HashRouter>
        <LabeledData data="Test Data!" label="Test Label" />
      </HashRouter>,
    )
    expect(screen.getByText('Test Data!')).toBeInTheDocument()
    expect(screen.getByText('Test Label:')).toBeInTheDocument()
    expect(screen.queryByTestId('Test LabelLink')).not.toBeInTheDocument()
  })

  test('renders link if given', () => {
    render(
      <HashRouter>
        <LabeledData data="Test Data!" label="Test Label" link="/some/link" />
      </HashRouter>,
    )
    expect(screen.getByTestId('Test LabelLink')).toHaveAttribute(
      'href',
      '#/some/link',
    )
  })
})
