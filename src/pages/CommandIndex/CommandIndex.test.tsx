import { render, screen, waitFor } from '@testing-library/react'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { PermissionsContainer } from 'containers/PermissionsContainer'
import Router from 'react-router-dom'
import { mockAxios } from 'test/axios-mock'
import { TSystem } from 'test/system-test-values'
import { TServerConfig } from 'test/test-values'
import { AllProviders, LoggedInProviders } from 'test/testMocks'

import { CommandIndex } from './CommandIndex'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}))

const templateHTML =
  '<p>I am a template</p><div id="js-msg"></div>' +
  '<script> document.getElementById("js-msg").innerHTML = "<p>... with JS!</p>" </script>'

const templateSystem = { ...TSystem, template: templateHTML }

describe('CommandIndex', () => {
  afterAll(() => {
    jest.unmock('react-router-dom')
    jest.clearAllMocks()
  })

  describe('renders table for', () => {
    test('valid namespace/system/version', async () => {
      jest.spyOn(Router, 'useParams').mockReturnValue({
        systemName: TSystem.name,
        namespace: TSystem.namespace,
        version: TSystem.version,
      })
      render(
        <AllProviders>
          <CommandIndex />
        </AllProviders>,
      )
      await waitFor(() => {
        expect(screen.getByText('Commands')).toBeInTheDocument()
      })
      expect(screen.getByText(TSystem.commands[0].name)).toBeInTheDocument()
      expect(screen.queryByText(/Error:/)).not.toBeInTheDocument()
    })

    test('valid namespace/system', async () => {
      jest.spyOn(Router, 'useParams').mockReturnValue({
        systemName: TSystem.name,
        namespace: TSystem.namespace,
        version: undefined,
      })
      render(
        <AllProviders>
          <CommandIndex />
        </AllProviders>,
      )
      await waitFor(() => {
        expect(screen.getByText('Commands')).toBeInTheDocument()
      })
      expect(screen.getByText(TSystem.commands[0].name)).toBeInTheDocument()
      expect(screen.queryByText(/Error:/)).not.toBeInTheDocument()
    })

    test('valid namespace', async () => {
      jest.spyOn(Router, 'useParams').mockReturnValue({
        systemName: undefined,
        namespace: TSystem.namespace,
        version: undefined,
      })
      render(
        <AllProviders>
          <CommandIndex />
        </AllProviders>,
      )
      await waitFor(() => {
        expect(screen.getByText('Commands')).toBeInTheDocument()
      })
      expect(screen.getByText(TSystem.commands[0].name)).toBeInTheDocument()
      expect(screen.queryByText(/Error:/)).not.toBeInTheDocument()
    })
  })

  describe('renders alert for', () => {
    test('invalid namespace', async () => {
      jest.spyOn(Router, 'useParams').mockReturnValue({
        systemName: undefined,
        namespace: 'notExistent',
        version: undefined,
      })
      render(
        <AllProviders>
          <CommandIndex />
        </AllProviders>,
      )
      await waitFor(() => {
        expect(screen.getByText('Commands')).toBeInTheDocument()
      })
      expect(
        screen.getByText(
          `Error: 204 No commands found for ${undefined} system in ` +
            `${'notExistent'} namespace.`,
        ),
      ).toBeInTheDocument()
      expect(
        screen.queryByText(new RegExp(TSystem.commands[0].name)),
      ).not.toBeInTheDocument()
    })

    test('invalid system', async () => {
      jest.spyOn(Router, 'useParams').mockReturnValue({
        systemName: 'notExistent',
        namespace: TSystem.namespace,
        version: undefined,
      })
      render(
        <AllProviders>
          <CommandIndex />
        </AllProviders>,
      )
      await waitFor(() => {
        expect(screen.getByText('Commands')).toBeInTheDocument()
      })
      expect(
        screen.getByText(
          `Error: 204 No commands found for ${'notExistent'} system in ` +
            `${TSystem.namespace} namespace.`,
        ),
      ).toBeInTheDocument()
      expect(
        screen.queryByText(new RegExp(TSystem.commands[0].name)),
      ).not.toBeInTheDocument()
    })

    test('invalid version', async () => {
      jest.spyOn(Router, 'useParams').mockReturnValue({
        systemName: TSystem.name,
        namespace: TSystem.namespace,
        version: 'notExistent',
      })
      render(
        <AllProviders>
          <CommandIndex />
        </AllProviders>,
      )
      await waitFor(() => {
        expect(screen.getByText('Commands')).toBeInTheDocument()
      })
      expect(
        screen.getByText(
          `Error: 204 No commands found for ${TSystem.name} system in ` +
            `${TSystem.namespace} namespace for version ${'notExistent'}.`,
        ),
      ).toBeInTheDocument()
      expect(
        screen.queryByText(new RegExp(TSystem.commands[0].name)),
      ).not.toBeInTheDocument()
    })

    test('axios fail', async () => {
      jest.spyOn(Router, 'useParams').mockReturnValue({
        systemName: TSystem.name,
        namespace: TSystem.namespace,
        version: TSystem.version,
      })
      mockAxios.onGet('/api/v1/systems').reply(400, { message: 'Bad return' })
      render(
        <AllProviders>
          <CommandIndex />
        </AllProviders>,
      )
      await waitFor(() => {
        expect(screen.getByText('Error: 400')).toBeInTheDocument()
      })
      expect(
        screen.queryByText(new RegExp(TSystem.commands[0].name)),
      ).not.toBeInTheDocument()
      mockAxios.onGet('/api/v1/systems').reply(200, [TSystem])
    })
  })

  test('system template no JS', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({
      systemName: TSystem.name,
      namespace: TSystem.namespace,
      version: TSystem.version,
    })
    mockAxios.onGet('/api/v1/systems').reply(200, [templateSystem])
    render(
      <AllProviders>
        <CommandIndex />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText('Commands')).toBeInTheDocument()
    })
    expect(screen.getByText('I am a template')).toBeInTheDocument()
    expect(screen.queryByText('... with JS!')).not.toBeInTheDocument()
    expect(screen.queryByText(TSystem.commands[0].name)).not.toBeInTheDocument()
    expect(screen.queryByText(/Error:/)).not.toBeInTheDocument()
  })

  test('system template with JS', async () => {
    jest.spyOn(ServerConfigContainer, 'useContainer').mockReturnValue({
      config: { ...TServerConfig, execute_javascript: true },
      authEnabled: false,
      debugEnabled: false,
    })
    jest.spyOn(Router, 'useParams').mockReturnValue({
      systemName: TSystem.name,
      namespace: TSystem.namespace,
      version: TSystem.version,
    })
    mockAxios.onGet('/api/v1/systems').reply(200, [templateSystem])
    render(
      <AllProviders>
        <CommandIndex />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText('Commands')).toBeInTheDocument()
    })
    expect(screen.getByText('I am a template')).toBeInTheDocument()
    expect(screen.getByTestId('dangerous')).toHaveTextContent('... with JS!')
    expect(screen.queryByText(TSystem.commands[0].name)).not.toBeInTheDocument()
    expect(screen.queryByText(/Error:/)).not.toBeInTheDocument()
  })

  test('execute button column if permission', async () => {
    jest.spyOn(PermissionsContainer, 'useContainer').mockReturnValue({
      hasPermission: jest.fn(),
      hasGardenPermission: jest.fn(),
      hasJobPermission: jest.fn(),
      isPermissionsSet: jest.fn(),
      hasSystemPermission: () => Promise.resolve(true),
    })
    jest.spyOn(ServerConfigContainer, 'useContainer').mockReturnValue({
      config: TServerConfig,
      authEnabled: true,
      debugEnabled: false,
    })
    jest.spyOn(Router, 'useParams').mockReturnValue({
      systemName: TSystem.name,
      namespace: TSystem.namespace,
      version: TSystem.version,
    })
    mockAxios.onGet('/api/v1/systems').reply(200, [TSystem])
    render(
      <LoggedInProviders>
        <CommandIndex />
      </LoggedInProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText('Execute')).toBeInTheDocument()
    })
  })

  test('no execute column if no permission', async () => {
    jest.spyOn(PermissionsContainer, 'useContainer').mockReturnValue({
      hasPermission: jest.fn(),
      hasGardenPermission: jest.fn(),
      hasJobPermission: jest.fn(),
      isPermissionsSet: jest.fn(),
      hasSystemPermission: () => Promise.resolve(true),
    })
    jest.spyOn(ServerConfigContainer, 'useContainer').mockReturnValue({
      config: TServerConfig,
      authEnabled: true,
      debugEnabled: false,
    })
    jest.spyOn(Router, 'useParams').mockReturnValue({
      systemName: TSystem.name,
      namespace: TSystem.namespace,
      version: TSystem.version,
    })
    render(
      <LoggedInProviders>
        <CommandIndex />
      </LoggedInProviders>,
    )
    await waitFor(() => {
      expect(screen.queryByText('Execute')).not.toBeInTheDocument()
    })
  })
})
