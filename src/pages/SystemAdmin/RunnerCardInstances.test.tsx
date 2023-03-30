import { render, screen, waitFor } from '@testing-library/react'
import { RunnerCardInstances } from 'pages/SystemAdmin'
import { TRunner, TRunner2 } from 'test/system-test-values'
import { AllProviders } from 'test/testMocks'
import { SnackbarState } from 'types/custom-types'

describe('RunnerCardInstances', () => {
    test('passes in two runners', async () => {
        render(
        <AllProviders>
            <RunnerCardInstances runners={[TRunner, TRunner2]} setAlert={(alert: SnackbarState) => {return}} />
        </AllProviders>,
        )
        await waitFor(() => {
            expect(screen.getByText(TRunner2.id)).toBeInTheDocument()
        })
        expect(screen.getByText(TRunner.id)).toBeInTheDocument()
    })
})