import { fireEvent, render, screen } from '@testing-library/react'
import { HashRouter } from 'react-router-dom'

import { JsonCard } from './JsonCard'

const testObject = {
  value: 'to test for',
  another: 'test val',
}

describe('JSON Card', () => {
  test('renders card to hold data', async () => {
    render(
      <HashRouter>
        <JsonCard
          iconTrigger={true}
          collapseHandler={jest.fn()}
          title="Test Modal"
          data={testObject}
        />
      </HashRouter>,
    )
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Expand Area' }),
    ).toBeInTheDocument()
  })

  test('renders JSON object if data', () => {
    render(
      <HashRouter>
        <JsonCard
          iconTrigger={true}
          collapseHandler={jest.fn()}
          title="Test Modal"
          data={testObject}
        />
      </HashRouter>,
    )
    expect(screen.getByText(`"${testObject.value}"`)).toBeInTheDocument()
    expect(screen.getByText(Object.keys(testObject)[1])).toBeInTheDocument()
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })

  test('renders progress if no data', () => {
    render(
      <HashRouter>
        <JsonCard
          iconTrigger={true}
          collapseHandler={jest.fn()}
          title="Test Modal"
          data={undefined}
        />
      </HashRouter>,
    )
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  test('clickable expand icon', () => {
    const mockFn = jest.fn()
    render(
      <HashRouter>
        <JsonCard
          iconTrigger={true}
          collapseHandler={mockFn}
          title="Test Modal"
          data={testObject}
        />
      </HashRouter>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Expand Area' }))
    expect(mockFn).toHaveBeenCalledTimes(1)
  })
})
