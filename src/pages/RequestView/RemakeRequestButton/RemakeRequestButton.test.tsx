import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import {
  emptyJobRequestCreationProviderState,
  JobRequestCreationContext,
} from 'components/JobRequestCreation'
import { AllProviders } from 'test/testMocks'

import { RemakeRequestButton } from './RemakeRequestButton'
import { buttonText, DummyRequest } from './remakeRequestButtonHelpers'

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
})
