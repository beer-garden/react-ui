import { Box, Stack, TextField } from '@mui/material'
import { ModalWrapper } from 'components/ModalWrapper'
import { Snackbar } from 'components/Snackbar'
import useUsers from 'hooks/useUsers'
import { ChangeEvent, useEffect, useState } from 'react'
import { SnackbarState } from 'types/custom-types'

interface ModalProps {
  open: boolean
  setOpen: (b: boolean) => void
  updateUsers: () => void
}

const NewUserModal = ({ open, setOpen, updateUsers }: ModalProps) => {
  const [debounce, setDebounce] = useState<NodeJS.Timeout | undefined>()
  const [error, setError] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirm, setConfirm] = useState<string>('')
  const [alert, setAlert] = useState<SnackbarState | undefined>(undefined)

  const { createUser } = useUsers()

  const clearForm = () => {
    setOpen(false)
    setName('')
    setPassword('')
    setConfirm('')
  }

  useEffect(() => {
    if (debounce) {
      clearTimeout(debounce)
      setDebounce(undefined)
    }
    setDebounce(
      setTimeout(() => {
        if (password && confirm && password !== confirm) {
          setError(true)
        } else setError(false)
      }, 500),
    )
    return () => {
      clearTimeout(debounce)
      setDebounce(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirm])

  return (
    <>
      <ModalWrapper
        open={open}
        header="Create User"
        onClose={() => {
          clearForm()
        }}
        onCancel={() => {
          clearForm()
        }}
        onSubmit={() => {
          if (name && password && password === confirm) {
            createUser(name, password)
              .then(() => {
                setAlert({
                  severity: 'success',
                  message: `User ${name} successfully created!`,
                })
                clearForm()
                updateUsers()
              })
              .catch((e) => {
                setAlert({
                  severity: 'error',
                  message: e.response?.data.message || e,
                  doNotAutoDismiss: true,
                })
              })
          } else {
            setAlert({
              severity: 'error',
              message: 'Please fill out entire form properly',
              doNotAutoDismiss: true,
            })
          }
        }}
        styleOverrides={{ size: 'xs', top: '-55%' }}
        content={
          <Box component="form" noValidate autoComplete="off">
            <Stack spacing={3}>
              <TextField
                value={name}
                size="small"
                label="Username"
                required
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setName(event.target.value)
                }}
              />
              <TextField
                value={password}
                size="small"
                type="password"
                label="Password"
                required
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setPassword(event.target.value)
                }}
              />
              <TextField
                value={confirm}
                size="small"
                type="password"
                label="Confirm Password"
                required
                error={error}
                helperText={error ? 'Passwords must match' : ''}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setConfirm(event.target.value)
                }}
              />
            </Stack>
          </Box>
        }
      />
      {alert ? <Snackbar status={alert} /> : null}
    </>
  )
}

export default NewUserModal
