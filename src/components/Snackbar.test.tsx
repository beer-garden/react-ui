import { AlertColor } from '@mui/material'
import { render, screen } from '@testing-library/react'

import { Snackbar } from './Snackbar'

describe('Snackbar', () => {
  const message = 'this is a message'

  for (const snackbarType of ['info', 'error', 'warning', 'success']) {
    test(`renders ${snackbarType} snackbar with no message`, () => {
      render(
        <Snackbar
          status={{
            severity: snackbarType as AlertColor,
          }}
        />,
      )

      expect(screen.getByText(snackbarType.toUpperCase())).toBeInTheDocument()
    })

    test(`renders ${snackbarType} snackbar with message`, () => {
      render(
        <Snackbar
          status={{
            severity: snackbarType as AlertColor,
            message: message,
          }}
        />,
      )

      expect(
        screen.getByText(`${snackbarType.toUpperCase()}: ${message}`),
      ).toBeInTheDocument()
    })

    test(`renders ${snackbarType} snackbar with message and no severity`, () => {
      render(
        <Snackbar
          status={{
            severity: snackbarType as AlertColor,
            message: message,
            showSeverity: false,
          }}
        />,
      )
      expect(screen.getByText(`${message}`)).toBeInTheDocument()
    })
  }

  test('passes props to MUI snackbar', () => {
    render(
      <Snackbar
        status={{
          severity: 'error' as AlertColor,
          message: message,
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      />,
    )

    expect(
      screen
        .getByRole('presentation')
        .classList.contains('MuiSnackbar-anchorOriginTopRight'),
    ).toBe(true)
  })
})
