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
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
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
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  test('renders children if given', () => {
    render(
      <HashRouter>
        <LabeledData data="Test Data!" label="Test Label">
          This Is Child
        </LabeledData>
      </HashRouter>,
    )
    expect(screen.getByText('Test Label: This Is Child')).toBeInTheDocument()
    expect(screen.queryByTestId('Test LabelLink')).not.toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  test('renders as alert if indicated', () => {
    render(
      <HashRouter>
        <LabeledData data="Test Data!" label="Test Label" alert />
      </HashRouter>,
    )
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveClass('MuiAlert-filledSuccess')
    expect(screen.queryByTestId('Test LabelLink')).not.toBeInTheDocument()
  })
})
