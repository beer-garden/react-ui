import {
  fireEvent,
  getDefaultNormalizer,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { TInstance } from 'test/system-test-values'
import { TLog } from 'test/test-values'
import { AllProviders } from 'test/testMocks'

import LogModal from './LogModal'

describe('Log Modal', () => {
  test('renders modal window with contents', async () => {
    render(
      <AllProviders>
        <LogModal instance={TInstance} fileHeader="TestFile" />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Get Tail Logs' }),
      ).toBeInTheDocument()
    })
    expect(
      screen.getByRole('button', { name: 'Get Line Logs' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Download Logs' }),
    ).toBeInTheDocument()
  })

  test('renders warning alert on init', async () => {
    render(
      <AllProviders>
        <LogModal instance={TInstance} fileHeader="TestFile" />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
    expect(
      screen.getByText(
        'Plugin must be listening to the Admin Queue and logging' +
          ' to File for logs to be returned. This will only return information' +
          ' from the log file being actively written to.',
      ),
    ).toBeInTheDocument()
  })

  test('displays tail logs', async () => {
    render(
      <AllProviders>
        <LogModal instance={TInstance} fileHeader="TestFile" />
      </AllProviders>,
    )
    expect(screen.getByText('Get Tail Logs')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Get Tail Logs'))
    await waitFor(() => {
      expect(
        screen.getByText(TLog, {
          normalizer: getDefaultNormalizer({ collapseWhitespace: false }),
        }),
      ).toBeInTheDocument()
    })
  })

  test('displays line logs', async () => {
    render(
      <AllProviders>
        <LogModal instance={TInstance} fileHeader="TestFile" />
      </AllProviders>,
    )
    expect(screen.getByText('Get Line Logs')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Get Line Logs'))
    await waitFor(() => {
      expect(
        screen.getByText(TLog, {
          normalizer: getDefaultNormalizer({ collapseWhitespace: false }),
        }),
      ).toBeInTheDocument()
    })
  })

  test('downloads log file', async () => {
    render(
      <AllProviders>
        <LogModal instance={TInstance} fileHeader="TestFile" />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText('Download Logs')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText('Download Logs'))
  })
})
