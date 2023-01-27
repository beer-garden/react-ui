import CloseIcon from '@mui/icons-material/Close'
import {
  Card,
  CardContent,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from '@mui/material'
import { useMountedState } from 'hooks/useMountedState'
import useUsers from 'hooks/useUsers'
import { ChangeEvent, useEffect } from 'react'
import {
  DomainScope,
  Role,
  RoleIdentifier,
  RolePatch,
} from 'types/backend-types'
import { SnackbarState } from 'types/custom-types'

interface ICard {
  role: RolePatch
  roleKey: string
  setRole: (n: string, s: DomainScope, i: RoleIdentifier) => void
  removeRole: () => void
  setAlert: (a: SnackbarState) => void
}

const RoleCard = ({ role, setAlert, roleKey, removeRole, setRole }: ICard) => {
  const [roleNames, setRoles] = useMountedState<string[]>([])

  const { getRoles } = useUsers()

  const handleChange = (value: string, key: string) => {
    switch (key) {
      case 'name':
        if (role.domain.scope === 'Garden')
          role.domain.identifiers = { name: value }
        else Object.assign(role.domain.identifiers, { name: value })
        break
      case 'namespace':
        Object.assign(role.domain.identifiers, { namespace: value })
        break
      case 'version':
        Object.assign(role.domain.identifiers, { version: value })
    }
    setRole(role.role_name, role.domain.scope, role.domain.identifiers)
  }

  useEffect(() => {
    getRoles()
      .then((response) => {
        setRoles(response.data.roles.map((role: Role) => role.name))
      })
      .catch((e) => {
        setAlert({
          severity: 'error',
          message: e.response?.data.message || e,
          doNotAutoDismiss: true,
        })
      })
  }, [getRoles, setAlert, setRoles])

  return (
    <Card>
      <CardContent>
        <IconButton
          sx={{ float: 'right' }}
          aria-label="Remove Role"
          onClick={removeRole}
        >
          <CloseIcon />
        </IconButton>
        <Stack direction="row" spacing={3}>
          <FormControl size="small">
            <InputLabel id={`${roleKey}-role-label`}>Role</InputLabel>
            <Select
              sx={{ minWidth: 100 }}
              labelId={`${roleKey}-role-label`}
              variant="outlined"
              value={roleNames.length > 0 ? role.role_name : ''}
              label="Role"
              onChange={(event: SelectChangeEvent) => {
                setRole(
                  event.target.value,
                  role.domain.scope,
                  role.domain.identifiers,
                )
              }}
            >
              {roleNames.map((name) => (
                <MenuItem key={name} value={name} dense divider>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small">
            <InputLabel id={`${roleKey}-scope-label`}>Scope</InputLabel>
            <Select
              sx={{ minWidth: 110 }}
              labelId={`${roleKey}-scope-label`}
              variant="outlined"
              value={role.domain.scope || ''}
              label="Scope"
              onChange={(event: SelectChangeEvent) => {
                setRole(
                  role.role_name,
                  event.target.value as DomainScope,
                  role.domain.identifiers,
                )
              }}
            >
              {['Garden', 'Global', 'System'].map((scope) => (
                <MenuItem key={scope} value={scope} dense divider>
                  {scope}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {(role.domain.scope === 'System' ||
            role.domain.scope === 'Garden') && (
            <TextField
              value={role.domain.identifiers.name || ''}
              size="small"
              label="Name"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                handleChange(event.target.value, 'name')
              }}
            />
          )}
          {role.domain.scope === 'System' && (
            <TextField
              value={role.domain.identifiers.namespace || ''}
              size="small"
              label="Namespace"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                handleChange(event.target.value, 'namespace')
              }}
            />
          )}
          {role.domain.scope === 'System' && (
            <TextField
              value={role.domain.identifiers.version || ''}
              size="small"
              label="Version"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                handleChange(event.target.value, 'version')
              }}
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

export { RoleCard }
