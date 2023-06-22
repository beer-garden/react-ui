import { render, screen, waitFor } from '@testing-library/react'
import {
  emptyJobRequestCreationProviderState,
  JobRequestCreationContext,
} from 'components/JobRequestCreation'
import * as mockUseSystems from 'hooks/useSystems'
import { TSystem } from 'test/system-test-values'
import { TJob } from 'test/test-values'
import { AllProviders } from 'test/testMocks'

import { UpdateJobButton } from './UpdateJobButton'

describe('UpdateJobButton', () => {
  test('callback fires', async () => {
    const mockGetSystems = jest.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        return { data: [TSystem] }
      })
    })
    jest.spyOn(mockUseSystems, 'useSystems').mockImplementation(() => {
      return {
        error: null,
        getSystems: mockGetSystems,
        reloadSystem: jest.fn(),
        deleteSystem: jest.fn(),
      }
    })
    const context = {
      ...emptyJobRequestCreationProviderState,
      setJob: jest.fn(),
      setRequestModel: jest.fn(),
      setSystem: jest.fn(),
      setCommand: jest.fn(),
    }

    render(
      <AllProviders>
        <JobRequestCreationContext.Provider value={context}>
          <UpdateJobButton job={TJob} />
        </JobRequestCreationContext.Provider>
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText('Update Job')).toBeInTheDocument()
    })
  })
})
