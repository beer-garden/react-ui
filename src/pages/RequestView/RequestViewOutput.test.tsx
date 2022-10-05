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
    const requestParams = {
      output: 'output', 
      status: 'SUCCESS'
    }

    const mockRequestSuccess = Object.assign({}, TRequest, requestParams)

    render(
      <AllProviders>
        <RequestViewOutput
          request={mockRequestSuccess}
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

    const expectedOutput = requestParams.output
    expect(screen.getByText(expectedOutput)).toBeInTheDocument()
  })
})
