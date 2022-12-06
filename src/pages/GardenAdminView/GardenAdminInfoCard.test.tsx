import { render, screen, waitFor } from '@testing-library/react'
import { mockAxios, regexUsers } from 'test/axios-mock'
import { TGarden } from 'test/garden-test-values'
import { AllProviders } from 'test/testMocks'
import { TUser } from 'test/user-test-values'

import { GardenAdminInfoCard } from './GardenAdminInfoCard'

describe('GardenAdminInfoCard', () => {
  test('should show garden data', async () => {
    mockAxios.onGet(regexUsers).reply(200, TUser)
    render(
      <AllProviders>
        <GardenAdminInfoCard garden={TGarden} />
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText(TGarden.name)).toBeInTheDocument()
    })
    expect(screen.getByText(TGarden.name)).toBeInTheDocument()
    expect(screen.getByText(TGarden.status)).toBeInTheDocument()
    expect(
      screen.getByText(`${'\u25CF'} ${TGarden.namespaces[0]}`),
    ).toBeInTheDocument()
  })
})
