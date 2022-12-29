import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { AxiosError } from 'axios'
import { Divider } from 'components/Divider'
import { ErrorAlert } from 'components/ErrorAlert'
import { ModalWrapper } from 'components/ModalWrapper'
import { PageHeader } from 'components/PageHeader'
import { Snackbar } from 'components/Snackbar'
import { PermissionsContainer } from 'containers/PermissionsContainer'
import useUsers from 'hooks/useUsers'
import { RoleCard } from 'pages/UsersView'
import { GardenSyncTable } from 'pages/UsersView'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import {
  DomainScope,
  RoleAssignment,
  RoleIdentifier,
  RolePatch,
  SyncStatus,
  UserPatch,
} from 'types/backend-types'
import { SnackbarState } from 'types/custom-types'

export const UsersView = () => {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<boolean>(false)
  const [errorFetch, setErrorFetch] = useState<AxiosError>()
  const [debounce, setDebounce] = useState<NodeJS.Timeout | undefined>()
  const [password, setPassword] = useState<string>('')
  const [confirm, setConfirm] = useState<string>('')
  const [alert, setAlert] = useState<SnackbarState | undefined>(undefined)
  const [roles, setRoles] = useState<RolePatch[]>([])
  const [sync, setSync] = useState<SyncStatus | null>(null)
  const { hasPermission } = PermissionsContainer.useContainer()
  const { getUser, deleteUser, updateUser } = useUsers()

  const params = useParams()
  const navigate = useNavigate()
  const userName = String(params.userName)

  useEffect(() => {
    getUser(userName)
      .then((response) => {
        setRoles(
          response.data.role_assignments.map((r: RoleAssignment) =>
            Object.assign(r, { role_name: r.role.name }),
          ),
        )
        setSync(response.data.sync_status)
      })
      .catch((e) => {
        setErrorFetch(e)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName])

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

  const changeUserObj = useCallback(() => {
    const newRole: RolePatch = {
      domain: { scope: 'Global', identifiers: {} },
      role_id: '',
      role_name: '',
    }
    const allRoles = [...roles, newRole]
    setRoles(allRoles)
  }, [roles])

  return !errorFetch ? (
    <>
      {hasPermission('user:delete') && (
        <Tooltip title="Remove User">
          <Button
            style={{ float: 'right' }}
            variant="contained"
            color="error"
            aria-label="Remove user"
            onClick={() => setOpen(true)}
          >
            <DeleteIcon />
          </Button>
        </Tooltip>
      )}
      <ModalWrapper
        open={open}
        header={`Remove ${userName} User?`}
        onClose={() => {
          setOpen(false)
        }}
        onCancel={() => {
          setOpen(false)
        }}
        onSubmit={() => {
          deleteUser(userName)
            .then(() => {
              setOpen(false)
              navigate('/admin/users')
            })
            .catch((e) => {
              setOpen(false)
              setAlert({
                severity: 'error',
                message: e.response?.data.message || e,
                doNotAutoDismiss: true,
              })
            })
        }}
        content={
          <Typography my={2}>
            Remove {userName} from systems. This action cannot be undone.
          </Typography>
        }
        styleOverrides={{ size: 'sm', top: '-55%' }}
      />
      <PageHeader title={userName} description="" />
      <Divider />
      <Stack spacing={2}>
        {sync && Object.keys(sync).length > 0 && (
          <GardenSyncTable syncObj={sync} />
        )}
        <Typography variant="h3">Change Password</Typography>
        <Box component="form" noValidate autoComplete="off">
          <Stack direction="row" spacing={3}>
            <TextField
              value={password}
              size="small"
              type="password"
              label="Password"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setPassword(event.target.value)
              }}
            />
            <TextField
              value={confirm}
              size="small"
              type="password"
              label="Confirm Password"
              error={error}
              helperText={error ? 'Passwords must match' : ''}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setConfirm(event.target.value)
              }}
            />
          </Stack>
        </Box>
        <Typography variant="h3">Role Assignments</Typography>
        {roles.map((role, index) => {
          return (
            <RoleCard
              key={`role${index}`}
              setRole={(n: string, s: DomainScope, i: RoleIdentifier) => {
                const newRole: RolePatch = {
                  role_name: n,
                  domain: { identifiers: i, scope: s },
                }
                const newRoles = [...roles]
                newRoles.splice(index, 1, newRole)
                setRoles(newRoles)
              }}
              removeRole={() => {
                const newRoles = [...roles]
                newRoles.splice(index, 1)
                setRoles(newRoles)
              }}
              role={role}
              setAlert={setAlert}
            />
          )
        })}
        <Tooltip title="Add new role">
          <IconButton onClick={changeUserObj}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Stack>
      <Tooltip title="Save">
        <Button
          fullWidth={false}
          variant="contained"
          disabled={error}
          aria-label="Save"
          onClick={() => {
            const data: UserPatch = { role_assignments: roles }
            if (password.length > 0) {
              data.password = password
            }
            updateUser(userName, data)
              .then(() => {
                setPassword('')
                setConfirm('')
                setAlert({
                  severity: 'success',
                  message: 'Successfully updated user',
                })
              })
              .catch((e) => {
                setAlert({
                  severity: 'error',
                  message: e.response?.data.message || e,
                  doNotAutoDismiss: true,
                })
              })
          }}
        >
          <SaveIcon />
        </Button>
      </Tooltip>
      {alert && <Snackbar status={alert} />}
    </>
  ) : errorFetch?.response ? (
    <ErrorAlert
      statusCode={errorFetch.response?.status}
      specific="user"
      errorMsg={errorFetch.response.statusText}
    />
  ) : (
    <Backdrop open={true}>
      <CircularProgress color="inherit" aria-label="User data loading" />
    </Backdrop>
  )
}
