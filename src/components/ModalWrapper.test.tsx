import { Typography } from '@mui/material'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { HashRouter } from 'react-router-dom'

import { ModalWrapper } from './ModalWrapper'

describe('Modal Wrapper', () => {
  test('renders modal window with contents', () => {
    const mockFn = jest.fn()
    render(
      <HashRouter>
        <ModalWrapper
          open={true}
          onClose={mockFn}
          header="This Is A Test Modal"
          content={<Typography>So much test</Typography>}
        />
      </HashRouter>,
    )
    expect(screen.getByText('So much test')).toBeInTheDocument()
    expect(screen.getByText('This Is A Test Modal')).toBeInTheDocument()
  })

  test('does not render modal window when trigger is false', () => {
    const mockFn = jest.fn()
    render(
      <HashRouter>
        <ModalWrapper
          open={false}
          onClose={mockFn}
          header="This Is A Test Modal"
          content={<Typography>So much test</Typography>}
        />
      </HashRouter>,
    )
    expect(screen.queryByText('So much test')).not.toBeInTheDocument()
    expect(screen.queryByText('This Is A Test Modal')).not.toBeInTheDocument()
  })

  test('adds submit button when given callback', async () => {
    const mockFn = jest.fn()
    render(
      <HashRouter>
        <ModalWrapper
          open={true}
          onClose={mockFn}
          onSubmit={mockFn}
          header="This Is A Test Modal"
          content={<Typography>So much test</Typography>}
        />
      </HashRouter>,
    )
    expect(screen.getByText('Submit')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Submit'))
    await waitFor(() => {
      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })

  test('adds cancel button when given callback', async () => {
    const mockFn = jest.fn()
    render(
      <HashRouter>
        <ModalWrapper
          open={true}
          onClose={mockFn}
          onCancel={mockFn}
          header="This Is A Test Modal"
          content={<Typography>So much test</Typography>}
        />
      </HashRouter>,
    )
    expect(screen.getByText('Cancel')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Cancel'))
    await waitFor(() => {
      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })

  test('adds custom button when given prop', async () => {
    const mockFn = jest.fn()
    render(
      <HashRouter>
        <ModalWrapper
          open={true}
          onClose={mockFn}
          customButton={{ label: 'Test Button!', cb: mockFn }}
          header="This Is A Test Modal"
          content={<Typography>So much test</Typography>}
        />
      </HashRouter>,
    )
    expect(screen.getByText('Test Button!')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Test Button!'))
    await waitFor(() => {
      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })
})
