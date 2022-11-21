import AddIcon from '@mui/icons-material/Add'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import SyncIcon from '@mui/icons-material/Sync'
import { Alert, Box, Button, Tooltip } from '@mui/material'
import { Divider } from 'components/Divider'
import NewUserModal from 'components/NewUserModal'
import { PageHeader } from 'components/PageHeader'
import { Snackbar } from 'components/Snackbar'
import SyncUserModal from 'components/SyncUserModal'
import { Table } from 'components/Table'
import { DefaultCellRenderer } from 'components/Table/defaults'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { PermissionsContainer } from 'containers/PermissionsContainer'
import useUsers from 'hooks/useUsers'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Column } from 'react-table'
import { User } from 'types/backend-types'
import {
  ObjectWithStringKeys,
  SnackbarState,
  SyncUser,
} from 'types/custom-types'

interface UserIndexTableData extends ObjectWithStringKeys {
  username: JSX.Element
  sync?: JSX.Element
}

const useTableColumns = (sync: boolean) => {
  return useMemo<Column<UserIndexTableData>[]>(() => {
    if (sync) {
      return [
        {
          Header: 'Username',
          Cell: DefaultCellRenderer,
          accessor: 'username',
          filter: 'fuzzyText',
          canHide: false,
        },
        {
          Header: 'Fully Synced',
          Cell: DefaultCellRenderer,
          accessor: 'sync',
        },
      ]
    }
    return [
      {
        Header: 'Username',
        Cell: DefaultCellRenderer,
        accessor: 'username',
        filter: 'fuzzyText',
        canHide: false,
      },
    ]
  }, [sync])
}

export const UsersIndex = () => {
  const { hasPermission } = PermissionsContainer.useContainer()
  const { authEnabled } = ServerConfigContainer.useContainer()
  const [openAdd, setOpenAdd] = useState<boolean>(false)
  const [openSync, setOpenSync] = useState<boolean>(false)
  const [syncStatus, setSyncStatus] = useState<boolean>(false)
  const [users, setUsers] = useState<SyncUser[]>([])
  const [alert, setAlert] = useState<SnackbarState | undefined>(undefined)
  const { getUsers } = useUsers()

  useEffect(() => {
    updateUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   * Fetch fresh list of users and set to useState
   */
  const updateUsers = () => {
    getUsers()
      .then((response) => {
        const tmpUsers: SyncUser[] = []
        response.data.users.forEach((user: User) => {
          const tmpUser = Object.assign({ fullySynced: false }, user)
          if (user.sync_status) {
            tmpUser.fullySynced = true
            setSyncStatus(true)
            Object.values(user.sync_status).forEach((synced) => {
              if (!synced) {
                tmpUser.fullySynced = false
              }
            })
          }
          tmpUsers.push(tmpUser)
        })
        setUsers(tmpUsers)
      })
      .catch((e) => {
        setAlert({
          severity: 'error',
          message: e.response?.data.message || e,
          doNotAutoDismiss: true,
        })
      })
  }

  /**
   * Populate table data
   */
  const userData = useMemo(() => {
    return users.map((user: SyncUser): UserIndexTableData => {
      return {
        username: (
          <Box
            key={`${user.username}_link`}
            sx={{
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              width: '120px',
              display: 'block',
              overflow: 'hidden',
            }}
          >
            <Link to={`/admin/users/${user.username}`}>{user.username}</Link>
          </Box>
        ),
        sync:
          syncStatus && user.fullySynced ? (
            <CheckIcon color="success" />
          ) : syncStatus ? (
            <CloseIcon color="error" />
          ) : undefined,
      }
    })
  }, [syncStatus, users])

  return (
    <Box>
      {hasPermission('user:create') && (
        <Tooltip title="Add User">
          <Button
            sx={{ float: 'right', mx: 1 }}
            variant="contained"
            color="primary"
            aria-label="Add user"
            onClick={() => setOpenAdd(true)}
          >
            <AddIcon />
          </Button>
        </Tooltip>
      )}
      {syncStatus && hasPermission('garden:update') && (
        <Tooltip title="Sync Users">
          <Button
            sx={{ float: 'right', mx: 1 }}
            variant="contained"
            color="primary"
            aria-label="Sync user"
            onClick={() => setOpenSync(true)}
          >
            <SyncIcon />
          </Button>
        </Tooltip>
      )}
      <NewUserModal
        open={openAdd}
        setOpen={setOpenAdd}
        updateUsers={updateUsers}
      />
      <SyncUserModal open={openSync} setOpen={setOpenSync} />
      <PageHeader title="User Management" description="" />
      <Divider />
      {!authEnabled && (
        <Alert severity="warning">
          Warning - Beer Garden authorization is currently disabled. Changes
          made here will be persisted, but permissions will not be enforced.
          Contact your administrator to enable this feature.
        </Alert>
      )}
      <Table
        tableKey="Users"
        data={userData}
        columns={useTableColumns(syncStatus)}
        showGlobalFilter
        hideToolbar
      />
      {alert && <Snackbar status={alert} />}
    </Box>
  )
}
