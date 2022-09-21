import { render, waitFor } from '@testing-library/react'
import { AllProviders } from 'test/testMocks'

import App from './App'

describe('App', () => {
  test('main app renders', async () => {
    const { container } = render(
      <AllProviders>
        <App />
      </AllProviders>,
    )
    // await waitFor fixes 'code that causes React state updates should be wrapped into act(...):' error
    await waitFor(() => expect(container).toContainHTML('<header'))
  })
})
