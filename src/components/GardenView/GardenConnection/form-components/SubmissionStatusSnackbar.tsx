import { Alert as MuiAlert, Snackbar } from '@mui/material'
import { AlertProps } from '@mui/material/Alert'
import { FC, forwardRef, SyntheticEvent, useEffect, useState } from 'react'
import { SubmissionStatusState } from '../GardenConnectionForm'

const SubmissionStatusSnackbar: FC<SubmissionStatusSnackbarProps> = ({
  status,
}) => {
  const [open, setOpen] = useState(true)
  const isSuccessful = status.result === 'success'
  const statusMsg = isSuccessful ? status.result : status.msg

  useEffect(() => {
    setOpen(true)
  }, [status])

  const handleClose = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return
    setOpen(false)
  }

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity={isSuccessful ? 'success' : 'error'}
        sx={{ width: '100%' }}
      >
        {`Garden update: ${statusMsg}`}
      </Alert>
    </Snackbar>
  )
}

export default SubmissionStatusSnackbar

interface SubmissionStatusSnackbarProps {
  status: SubmissionStatusState
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert (
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})
