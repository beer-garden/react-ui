import { render, screen, waitFor } from '@testing-library/react'
import { TRequest } from 'test/test-values'
import { AllProviders } from 'test/testMocks'

import { RequestViewOutput } from './RequestViewOutput'

describe('RequestViewOutput', () => {
  const mockSetState = jest.fn()
  window.URL.createObjectURL = jest.fn(() => 'url')
  const mockTheme = 'dark'

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('renders output card with contents', async () => {
    render(
      <AllProviders>
        <RequestViewOutput
          request={TRequest}
          expandParameter={false}
          expandOutput={false}
          setExpandOutput={mockSetState}
          theme={mockTheme}
        />
      </AllProviders>,
    )

    await waitFor(() => {
      expect(screen.getByText('Output')).toBeInTheDocument()
    })

    expect(screen.getByLabelText('download output')).toBeInTheDocument()
    expect(screen.getByLabelText('expand output')).toBeInTheDocument()

    const expectedOutput = 'test output'
    expect(screen.getByText(expectedOutput)).toBeInTheDocument()
  })
})
