import { render, waitFor } from '@testing-library/react'
import { screen } from '@testing-library/react'
import {
  emptyJobRequestCreationProviderState,
  JobRequestCreationContext,
  JobRequestCreationProviderState,
} from 'components/JobRequestCreation'
import * as commandViewHelpers from 'pages/CommandView/commandViewHelpers'
import { TCommand, TSystem } from 'test/system-test-values'
import { AllProviders } from 'test/testMocks'
import { AugmentedCommand, StrippedSystem } from 'types/custom-types'
import {
  CommandViewJob,
  CommandViewJobModel,
  CommandViewRequestModel,
} from 'types/form-model-types'

import { CommandView } from './CommandView'

describe('CommandView', () => {
  let checkContext: jest.SpyInstance<
    JSX.Element | undefined,
    [
      namespace: string | undefined,
      systemName: string | undefined,
      version: string | undefined,
      commandName: string | undefined,
      system: StrippedSystem | undefined,
      command: AugmentedCommand | undefined,
      isReplay: boolean,
      requestModel: CommandViewRequestModel | undefined,
    ]
  >

  beforeEach(() => {
    checkContext = jest
      .spyOn(commandViewHelpers, 'checkContext')
      .mockImplementation(() => undefined)
  })

  afterEach(() => {
    checkContext.mockRestore()
  })
  test('renders request form with model context values', async () => {
    const testComment = 'Silly comment!'
    const testParameterValue = 'This is a parameter value'
    const { commands, ...theSystem } = TSystem
    const theCommand: AugmentedCommand = {
      ...TCommand,
      namespace: theSystem.namespace,
      systemName: theSystem.name,
      systemVersion: theSystem.version,
      systemId: theSystem.id,
    }
    const theRequestModel: CommandViewRequestModel = {
      comment: {
        comment: testComment,
      },
      instance_names: {
        instance_name: TSystem.instances[0].name,
      },
      parameters: {
        [theCommand.parameters[0].key]: testParameterValue,
      },
    }
    const TContextValues: JobRequestCreationProviderState = {
      ...emptyJobRequestCreationProviderState,
      system: theSystem as StrippedSystem,
      command: theCommand,
      isReplay: true,
      requestModel: theRequestModel,
    }

    render(
      <AllProviders>
        <JobRequestCreationContext.Provider value={TContextValues}>
          <CommandView />
        </JobRequestCreationContext.Provider>
      </AllProviders>,
    )

    // comment is inserted
    await waitFor(() => {
      expect(screen.getByDisplayValue(testComment)).toBeInTheDocument()
    })

    // parameter value is inserted
    await waitFor(() => {
      expect(screen.getByDisplayValue(testParameterValue)).toBeInTheDocument()
    })
  })

  test('renders job form with model context values', async () => {
    const jobName = 'My favorite job'
    const { commands, ...theSystem } = TSystem
    const theCommand: AugmentedCommand = {
      ...TCommand,
      namespace: theSystem.namespace,
      systemName: theSystem.name,
      systemVersion: theSystem.version,
      systemId: theSystem.id,
    }
    const theCommandViewJob: CommandViewJob = {
      name: jobName,
      trigger: 'date',
    }
    const theRequestModel: CommandViewJobModel = {
      comment: {
        comment: '',
      },
      instance_names: {
        instance_name: TSystem.instances[0].name,
      },
      parameters: {
        [theCommand.parameters[0].key]: 'This is a parameter value',
      },
      job: theCommandViewJob,
    }
    const TContextValues: JobRequestCreationProviderState = {
      ...emptyJobRequestCreationProviderState,
      system: theSystem as StrippedSystem,
      command: theCommand,
      isJob: true,
      isReplay: true,
      requestModel: theRequestModel,
    }

    render(
      <AllProviders>
        <JobRequestCreationContext.Provider value={TContextValues}>
          <CommandView />
        </JobRequestCreationContext.Provider>
      </AllProviders>,
    )

    // job name is inserted
    await waitFor(() => {
      expect(screen.getByDisplayValue(jobName)).toBeInTheDocument()
    })
  })
})
