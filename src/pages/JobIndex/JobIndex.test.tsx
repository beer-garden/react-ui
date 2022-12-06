import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { mockAxios, regexUsers } from 'test/axios-mock'
import { TJob, TServerAuthConfig } from 'test/test-values'
import { AllProviders, LoggedInProviders } from 'test/testMocks'
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
function createFile(
  name: string,
  contents: string[],
  type = 'application/json',
) {
  const file = new File(contents, name, { type })
  Object.defineProperty(file, 'size', {
    get() {
      return 1111
    },
  })
  return file
}

describe('JobIndex', () => {
  test('displays table with job data', async () => {
    render(
      <AllProviders>
        <JobIndex />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Request Scheduler' }),
      ).toBeInTheDocument()
    })
    expect(screen.getByText(TJob.name)).toBeInTheDocument()
    expect(screen.getByText(TJob.request_template.system)).toBeInTheDocument()
    expect(screen.getByText(TJob.request_template.command)).toBeInTheDocument()
    expect(screen.getByText(TJob.success_count as number)).toBeInTheDocument()
  })

  test('name and system are links', async () => {
    render(
      <AllProviders>
        <JobIndex />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText(TJob.name)).toBeInTheDocument()
    })
    const links: HTMLAnchorElement[] = screen.getAllByRole('link')
    expect(links[0].textContent).toEqual(TJob.name)
    expect(links[0].href).toContain(`http://localhost/#/jobs/${TJob.id}`)
    expect(links[1].textContent).toEqual(TJob.request_template.system)
    expect(links[1].href).toContain(
      `http://localhost/#/systems/${TJob.request_template.namespace}/${TJob.request_template.system}/${TJob.request_template.system_version}`,
    )
  })

  test('alerts on failure to get jobs', async () => {
    mockAxios
      .onGet('/api/v1/jobs')
      .reply(404, { message: 'Failure to get jobs' })
    render(
      <AllProviders>
        <JobIndex />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText('ERROR: Failure to get jobs')).toBeInTheDocument()
    })
    expect(screen.queryByText(TJob.name)).not.toBeInTheDocument()
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
          screen.getByText('SUCCESS: File file1 successfully added.'),
        ).toBeInTheDocument()
      })
      await waitFor(() => {
        expect(
          screen.queryByText(
            'ERROR: File file1 was rejected. File type not supported.',
          ),
        ).not.toBeInTheDocument()
      })
    })

    test('error on bad file', async () => {
      const files = [createFile('file1', [], 'img/png')]
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
          screen.getByText(
            'ERROR: File file1 was rejected. File type not supported.',
          ),
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
