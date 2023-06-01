import { render, screen, waitFor } from '@testing-library/react'
import {
  emptyJobRequestCreationProviderState,
  JobRequestCreationContext,
  JobRequestCreationProviderState,
} from 'components/JobRequestCreation'
import {
  TAugmentedCommand,
  TRequestCommandModel,
} from 'test/request-command-job-test-values'
import { TParameter, TSystem } from 'test/system-test-values'
import { AllProviders } from 'test/testMocks'
import { StrippedSystem } from 'types/custom-types'

import { CommandView } from './CommandView'

const { commands, ...theSystem } = TSystem
const CommandContextValues: JobRequestCreationProviderState = {
  ...emptyJobRequestCreationProviderState,
  system: theSystem as StrippedSystem,
  command: TAugmentedCommand,
  requestModel: TRequestCommandModel,
}

describe('CommandView', () => {

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
