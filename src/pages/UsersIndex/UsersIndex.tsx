import AddIcon from '@mui/icons-material/Add'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import SyncIcon from '@mui/icons-material/Sync'
import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Stack,
  Tooltip,
} from '@mui/material'
import { AxiosError } from 'axios'
import { Divider } from 'components/Divider'
import { ErrorAlert } from 'components/ErrorAlert'
import NewUserModal from 'components/NewUserModal'
import { PageHeader } from 'components/PageHeader'
import SyncUserModal from 'components/SyncUserModal'
import { Table } from 'components/Table'
import { DefaultCellRenderer } from 'components/Table/defaults'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { PermissionsContainer } from 'containers/PermissionsContainer'
import { useMountedState } from 'hooks/useMountedState'
import useUsers from 'hooks/useUsers'
import { useCallback, useEffect, useMemo } from 'react'
import { Column } from 'react-table'
import { User } from 'types/backend-types'
import { ObjectWithStringKeys, SyncUser } from 'types/custom-types'

interface UserIndexTableData extends ObjectWithStringKeys {
  username: string
  sync?: JSX.Element
}

const useTableColumns = (sync: boolean) => {
  return useMemo<Column<UserIndexTableData>[]>(() => {
    if (sync) {
      return [
        {
          Header: 'Username',
          accessor: 'username',
          linkKey: 'link',
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
        accessor: 'username',
        linkKey: 'link',
        filter: 'fuzzyText',
        canHide: false,
      },
    ]
  }, [sync])
}

export const UsersIndex = () => {
  const { hasPermission } = PermissionsContainer.useContainer()
  const { authEnabled } = ServerConfigContainer.useContainer()
  const [openAdd, setOpenAdd] = useMountedState<boolean>(false)
  const [openSync, setOpenSync] = useMountedState<boolean>(false)
  const [syncStatus, setSyncStatus] = useMountedState<boolean>(false)
  const [errorFetch, setErrorFetch] = useMountedState<AxiosError | undefined>()
  const [users, setUsers] = useMountedState<SyncUser[]>([])
  const { getUsers } = useUsers()

  /**
   * Fetch fresh list of users and set to useState
   */
  const updateUsers = useCallback(() => {
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
      .catch((e) => setErrorFetch(e))
  }, [getUsers, setErrorFetch, setSyncStatus, setUsers])

  useEffect(() => {
    updateUsers()
  }, [updateUsers])

  /**
   * Populate table data
   */
  const userData = useMemo(() => {
    return users.map((user: SyncUser): UserIndexTableData => {
      return {
        username: user.username,
        sync:
          syncStatus && user.fullySynced ? (
            <CheckIcon color="success" />
          ) : syncStatus ? (
            <CloseIcon color="error" />
          ) : undefined,
        link: `/admin/users/${user.username}`,
      }
    })
  }, [syncStatus, users])

  const tableColumns = useTableColumns(syncStatus)

  return !errorFetch ? (
    <Box>
      <Stack direction="row" spacing={2} sx={{ float: 'right' }}>
        {hasPermission('user:create') && (
          <Tooltip title="Add User">
            <Button
              variant="contained"
              color="secondary"
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
              variant="contained"
              color="primary"
              aria-label="Sync user"
              onClick={() => setOpenSync(true)}
            >
              <SyncIcon />
            </Button>
          </Tooltip>
        )}
      </Stack>
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
        columns={tableColumns}
        showGlobalFilter
        hideToolbar
      />
    </Box>
  ) : errorFetch?.response ? (
    <ErrorAlert
      statusCode={errorFetch.response?.status}
      errorMsg={errorFetch.response.statusText}
    />
  ) : (
    <Backdrop open={true}>
      <CircularProgress color="inherit" aria-label="User data loading" />
    </Backdrop>
  )
}
