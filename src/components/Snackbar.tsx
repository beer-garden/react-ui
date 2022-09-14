import {
  Alert as MuiAlert,
  Snackbar as MuiSnackbar,
  SnackbarProps as MuiSnackbarProps,
} from '@mui/material'
import { AlertColor, AlertProps } from '@mui/material/Alert'
import { forwardRef, SyntheticEvent, useEffect, useState } from 'react'
import { SnackbarState } from 'types/custom-types'

interface SnackbarArgs {
  status: SnackbarState
}
type SnackbarProps = SnackbarArgs & MuiSnackbarProps

/**
 * Produce the message displayed by the snackbar chip.
 *
 * @param severity - one of success, info, warning, error
 * @param message - the text of the message to display, optional
 * @param showSeverity - whether to preface the message with the severity;
 * ignored if no message is passed
 * @returns
 */
const getStatusMessage = (
  severity: AlertColor,
  message?: string,
  showSeverity = true,
) => {
  let msg: string | undefined = undefined
  const severityAsString = String(severity).toUpperCase()

  if (showSeverity) msg = severityAsString
  if (message) msg = msg ? msg + ': ' + message : message
  if (!msg) msg = severityAsString

  return msg
}

const SnackbarAlert = forwardRef<HTMLDivElement, AlertProps>((props, ref) => {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})
SnackbarAlert.displayName = 'SnackbarAlert'

const Snackbar = (props: SnackbarProps) => {
  const { status, ...muiSnackbarProps } = props
  const { severity, message, showSeverity, doNotAutoDismiss } = status
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    setIsOpen(true)
  }, [status])

  const handleClose = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return

    setIsOpen(false)
  }

  return (
    <MuiSnackbar
      open={isOpen}
      autoHideDuration={doNotAutoDismiss ? null : 5000}
      onClose={handleClose}
      {...muiSnackbarProps}
    >
      <SnackbarAlert
        onClose={handleClose}
        severity={severity}
        sx={{ width: '100%' }}
      >
        {getStatusMessage(severity, message, showSeverity)}
      </SnackbarAlert>
    </MuiSnackbar>
  )
}

export { Snackbar }
export type { SnackbarProps, SnackbarState }
