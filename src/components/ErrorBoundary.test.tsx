import { render, screen } from '@testing-library/react'

import ErrorBoundary from './ErrorBoundary'

describe('Error Boundary', () => {
  const original = console.error

  beforeEach(() => {
    console.error = jest.fn()
  })

  afterEach(() => {
    console.error = original
  })

  test('renders page when no error', () => {
    render(
      <ErrorBoundary>
        <div>Testing</div>
      </ErrorBoundary>,
    )
    expect(screen.getByText('Testing')).toBeInTheDocument()
  })

  test('renders error when error', () => {
    const Child = () => {
      throw new Error('Something wrong')
    }
    render(
      <ErrorBoundary>
        <div>Testing</div>
        <Child />
      </ErrorBoundary>,
    )
    expect(console.error).toHaveBeenCalled()
    expect(screen.queryByText('Testing')).not.toBeInTheDocument()
    expect(screen.getByText('Error: Something wrong')).toBeInTheDocument()
  })
})
