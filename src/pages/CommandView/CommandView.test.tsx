import { render, screen, waitFor } from '@testing-library/react'
import {
  emptyJobRequestCreationProviderState,
  JobRequestCreationContext,
  JobRequestCreationProviderState,
} from 'components/JobRequestCreation'
import * as commandViewHelpers from 'pages/CommandView/commandViewHelpers'
import {
  TAugmentedCommand,
  TRequestCommandModel,
  TRequestJobModel,
} from 'test/request-command-job-test-values'
import { TParameter, TSystem } from 'test/system-test-values'
import { AllProviders } from 'test/testMocks'
import { AugmentedCommand, StrippedSystem } from 'types/custom-types'
import { CommandViewRequestModel } from 'types/form-model-types'

import { CommandView } from './CommandView'

const { commands, ...theSystem } = TSystem
const CommandContextValues: JobRequestCreationProviderState = {
  ...emptyJobRequestCreationProviderState,
  system: theSystem as StrippedSystem,
  command: TAugmentedCommand,
  isReplay: true,
  requestModel: TRequestCommandModel,
}
const JobContextValues: JobRequestCreationProviderState = {
  ...emptyJobRequestCreationProviderState,
  system: theSystem as StrippedSystem,
  command: TAugmentedCommand,
  isJob: true,
  isReplay: true,
  requestModel: TRequestJobModel,
}

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
    render(
      <AllProviders>
        <JobRequestCreationContext.Provider value={CommandContextValues}>
          <CommandView />
        </JobRequestCreationContext.Provider>
      </AllProviders>,
    )
    // comment is inserted
    await waitFor(() => {
      expect(
        screen.getByDisplayValue(TRequestCommandModel.comment.comment),
      ).toBeInTheDocument()
    })
    // parameter value is inserted
    const paramString = TRequestCommandModel.parameters[
      TParameter.key
    ] as string
    await waitFor(() => {
      expect(screen.getByDisplayValue(paramString)).toBeInTheDocument()
    })
  })

  test('renders job form with model context values', async () => {
    render(
      <AllProviders>
        <JobRequestCreationContext.Provider value={JobContextValues}>
          <CommandView />
        </JobRequestCreationContext.Provider>
      </AllProviders>,
    )
    // job name is inserted
    await waitFor(() => {
      expect(
        screen.getByDisplayValue(TRequestJobModel.job.name),
      ).toBeInTheDocument()
    })
  })
})
