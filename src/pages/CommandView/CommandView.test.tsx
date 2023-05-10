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
} from 'test/request-command-job-test-values'
import { TParameter, TSystem } from 'test/system-test-values'
import { AllProviders } from 'test/testMocks'
import { RequestTemplate } from 'types/backend-types'
import { AugmentedCommand, StrippedSystem } from 'types/custom-types'
import { CommandViewJobModel, CommandViewRequestModel } from 'types/form-model-types'

import { CommandView } from './CommandView_new'

const { commands, ...theSystem } = TSystem
const CommandContextValues: JobRequestCreationProviderState = {
  ...emptyJobRequestCreationProviderState,
  system: theSystem as StrippedSystem,
  command: TAugmentedCommand,
  requestModel: TRequestCommandModel,
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
      requestModel: RequestTemplate | CommandViewJobModel | CommandViewRequestModel | undefined,
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
        screen.getByDisplayValue(TRequestCommandModel.comment || 'Silly comment!'),
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
})
