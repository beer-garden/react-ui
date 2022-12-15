import { render, screen, waitFor } from '@testing-library/react'
import { AllProviders } from 'test/testMocks'

import {
  ErrorAlert,
  errorMap,
  ErrorStatusCode,
  SpecificErrorType,
} from './ErrorAlert'

describe('ErrorAlert', () => {
  const errorMsg = 'my error message'
  for (const statusCode of [403, 404, 500]) {
    for (const specific of statusCode === 404
      ? [undefined, 'request', 'job', 'garden', 'user']
      : [undefined]) {
      test(`renders alert with status code ${statusCode} and specific ${specific}`, async () => {
        render(
          <AllProviders>
            <ErrorAlert
              statusCode={statusCode}
              errorMsg={errorMsg}
              specific={
                specific as 'request' | 'job' | 'garden' | 'user' | undefined
              }
            />
          </AllProviders>,
        )
        await waitFor(() => {
          expect(
            screen.getByText(`Error: ${statusCode} ${errorMsg}`),
          ).toBeInTheDocument()
        })
        expect(
          screen.getByText(
            `Problem: ${
              errorMap[statusCode as ErrorStatusCode]['common'][0].problem
            }`,
          ),
        ).toBeInTheDocument()
        const specificList =
          errorMap[statusCode as ErrorStatusCode][specific as SpecificErrorType]
        if (specificList) {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(
            screen.getByText(`Problem: ${specificList[0].problem}`),
          ).toBeInTheDocument()
        }
      })
    }
  }
})
