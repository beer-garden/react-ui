import { render, screen, waitFor } from '@testing-library/react'
import { TGarden } from 'test/garden-test-values'
import { AllProviders } from 'test/testMocks'

import { SystemsCard } from './SystemsCard'

describe('SystemsCard', () => {
  test('receives gardens', async () => {
    render(
      <AllProviders>
        <SystemsCard setError={() => {return}}/>
      </AllProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText(TGarden.systems[0].name)).toBeInTheDocument()
    })
    expect(screen.getByText(TGarden.systems[1].name)).toBeInTheDocument()
    expect(screen.getByText(`${TGarden.systems[0].namespace}/${TGarden.systems[0].version}`)).toBeInTheDocument()
    expect(screen.getByText(`${TGarden.systems[1].namespace}/${TGarden.systems[1].version}`)).toBeInTheDocument()
  })
})
