import { fireEvent, render, screen } from '@testing-library/react'
import {
  emptyJobRequestCreationProviderState,
  JobRequestCreationContext,
} from 'components/JobRequestCreation'
import { AllProviders } from 'test/testMocks'
import { Request } from 'types/backend-types'

import { RemakeRequestButton } from './RemakeRequestButton'

const DummyRequest: Request = {
  children: [],
  command: '',
  command_type: '',
  comment: '',
  created_at: 0,
  error_class: null,
  instance_name: '',
  namespace: '',
  output_type: '',
  parameters: {},
  parent: null,
  status: '',
  system: '',
  system_version: '',
  updated_at: 0,
  status_updated_at: 0,
}

describe('RemakeRequestButton', () => {
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
