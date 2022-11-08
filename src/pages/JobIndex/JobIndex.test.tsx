import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { mockAxios, regexUsers } from 'test/axios-mock'
import { TJob, TServerAuthConfig } from 'test/test-values'
import { LoggedInProviders } from 'test/testMocks'
import { TAdmin, TUser } from 'test/user-test-values'

import { JobIndex } from './JobIndex'

/**
 * createDtWithFiles creates a mock data transfer object that can be used for drop events
 * @param {File[]} files
 */
function createDtWithFiles(files: File[] = []) {
  return {
    dataTransfer: {
      files,
      items: files.map((file) => ({
        kind: 'file',
        size: file.size,
        type: file.type,
        getAsFile: () => file,
      })),
      types: ['Files'],
    },
  }
}

/**
 * createFile creates a mock File object
 * @param {string} name
 * @param {string[]} contents
 */
function createFile(name: string, contents: string[]) {
  const file = new File(contents, name, { type: 'application/pdf' })
  Object.defineProperty(file, 'size', {
    get() {
      return 1111
    },
  })
  return file
}

jest.mock('pages/JobIndex/jobIndexHelpers', () => ({
  getFormattedTable: jest.fn(),
}))

describe('JobIndex', () => {
  afterAll(() => {
    jest.unmock('pages/JobIndex/jobIndexHelpers')
    jest.clearAllMocks()
  })

  describe('import', () => {
    test('no button if no permission', async () => {
      mockAxios.onGet('/config').reply(200, TServerAuthConfig)
      mockAxios.onGet(regexUsers).reply(200, TUser)
      render(
        <LoggedInProviders>
          <JobIndex />
        </LoggedInProviders>,
      )
      await waitFor(() => {
        expect(screen.queryByText('IMPORT')).not.toBeInTheDocument()
      })
    })

    test('button if permission', async () => {
      mockAxios.onGet('/config').reply(200, TServerAuthConfig)
      mockAxios.onGet(regexUsers).reply(200, TAdmin)
      render(
        <LoggedInProviders>
          <JobIndex />
        </LoggedInProviders>,
      )
      await waitFor(() => {
        expect(screen.getByText('IMPORT')).toBeInTheDocument()
      })
    })

    test('button opens dialog', async () => {
      render(
        <LoggedInProviders>
          <JobIndex />
        </LoggedInProviders>,
      )
      fireEvent.click(screen.getByText('IMPORT'))
      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Import Jobs' }),
        ).toBeInTheDocument()
      })
    })

    test('cancel dialog', async () => {
      render(
        <LoggedInProviders>
          <JobIndex />
        </LoggedInProviders>,
      )
      fireEvent.click(screen.getByText('IMPORT'))
      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Import Jobs' }),
        ).toBeInTheDocument()
      })
      fireEvent.click(screen.getByText('Cancel'))
      await waitFor(() => {
        expect(
          screen.queryByRole('heading', { name: 'Import Jobs' }),
        ).not.toBeInTheDocument()
      })
    })

    test('dialog allows adding files', async () => {
      const files = [createFile('file1', [JSON.stringify([TJob])])]
      const data = createDtWithFiles(files)
      render(
        <LoggedInProviders>
          <JobIndex />
        </LoggedInProviders>,
      )
      fireEvent.click(screen.getByText('IMPORT'))
      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Import Jobs' }),
        ).toBeInTheDocument()
      })
      const dropzone = screen.getByText('Drag and drop a file here or click')
      fireEvent.drop(dropzone, data)
      await waitFor(() => {
        expect(
          screen.getByText('File file1 successfully added.'),
        ).toBeInTheDocument()
      })
      await waitFor(() => {
        expect(
          screen.queryByText('ERROR: Please upload JSON parsable file(s)'),
        ).not.toBeInTheDocument()
      })
    })

    test('error on bad file', async () => {
      const files = [createFile('file1', [])]
      const data = createDtWithFiles(files)
      render(
        <LoggedInProviders>
          <JobIndex />
        </LoggedInProviders>,
      )
      fireEvent.click(screen.getByText('IMPORT'))
      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Import Jobs' }),
        ).toBeInTheDocument()
      })
      const dropzone = screen.getByText('Drag and drop a file here or click')
      fireEvent.drop(dropzone, data)
      fireEvent.click(screen.getByText('Submit'))
      await waitFor(() => {
        expect(
          screen.getByText('ERROR: Please upload JSON parsable file(s)'),
        ).toBeInTheDocument()
      })
    })
  })

  test('create button if permission', async () => {
    mockAxios.onGet('/config').reply(200, TServerAuthConfig)
    mockAxios.onGet(regexUsers).reply(200, TAdmin)
    render(
      <LoggedInProviders>
        <JobIndex />
      </LoggedInProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText('Create')).toBeInTheDocument()
    })
  })

  test('no create button if no permission', async () => {
    mockAxios.onGet('/config').reply(200, TServerAuthConfig)
    mockAxios.onGet(regexUsers).reply(200, TUser)
    render(
      <LoggedInProviders>
        <JobIndex />
      </LoggedInProviders>,
    )
    await waitFor(() => {
      expect(screen.queryByText('Create')).not.toBeInTheDocument()
    })
  })
})
