import { fireEvent, render, screen } from '@testing-library/react'
import {
  emptyJobRequestCreationProviderState,
  JobRequestCreationContext,
} from 'components/JobRequestCreation'
import { Dispatch, SetStateAction } from 'react'
import { AllProviders } from 'test/testMocks'
import { AugmentedCommand, StrippedSystem } from 'types/custom-types'
import { CommandViewRequestModel } from 'types/form-model-types'

import { RemakeRequestButton } from './RemakeRequestButton'
import { DummyRequest } from './remakeRequestButtonHelpers'

describe('RemakeRequestButton', () => {
  afterAll(() => {
    jest.unmock('react-router-dom')
    jest.unmock('axios-hooks')
    jest.clearAllMocks()
  })

  test('Cannot execute on empty context', async () => {
    const errorText = 'ERROR: Unknown error'
    render(
      <AllProviders>
        <JobRequestCreationContext.Provider
          value={emptyJobRequestCreationProviderState}
        >
          <RemakeRequestButton request={DummyRequest} />
        </JobRequestCreationContext.Provider>
      </AllProviders>,
    )
    fireEvent.mouseOver(screen.getByTestId('cannot-execute-button'))
    expect(await screen.findByText(errorText)).toBeInTheDocument()
  })

  test('Cannot execute on undefined request', async () => {
    const errorText = 'ERROR: Request not available'
    const dummySetter = () => undefined

    render(
      <AllProviders>
        <JobRequestCreationContext.Provider
          value={{
            ...emptyJobRequestCreationProviderState,
            setSystem: dummySetter as unknown as Dispatch<
              SetStateAction<StrippedSystem | undefined>
            >,
            setCommand: dummySetter as unknown as Dispatch<
              SetStateAction<AugmentedCommand | undefined>
            >,
            setIsJob: dummySetter as unknown as Dispatch<
              SetStateAction<boolean>
            >,
            setRequestModel: dummySetter as unknown as Dispatch<
              SetStateAction<CommandViewRequestModel | undefined>
            >,
            setIsReplay: dummySetter as unknown as Dispatch<
              SetStateAction<boolean>
            >,
          }}
        >
          <RemakeRequestButton request={undefined} />
        </JobRequestCreationContext.Provider>
      </AllProviders>,
    )
    fireEvent.mouseOver(screen.getByTestId('cannot-execute-button'))
    expect(await screen.findByText(errorText)).toBeInTheDocument()
  })
})
