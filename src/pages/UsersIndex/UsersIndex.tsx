import AddIcon from '@mui/icons-material/Add'
import { Box, Button, Tooltip } from '@mui/material'
import { Divider } from 'components/Divider'
import NewUserModal from 'components/NewUserModal'
import { PageHeader } from 'components/PageHeader'
import { Snackbar } from 'components/Snackbar'
import { Table } from 'components/Table'
import useUsers from 'hooks/useUsers'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Column } from 'react-table'
import { User } from 'types/backend-types'
import { ObjectWithStringKeys, SnackbarState } from 'types/custom-types'

interface UserIndexTableData extends ObjectWithStringKeys {
  username: JSX.Element
}

const useTableColumns = () => {
  return useMemo<Column<UserIndexTableData>[]>(
    () => [
      {
        Header: 'Username',
        accessor: 'username',
        filter: 'fuzzyText',
        canHide: false,
      },
    ],
    [],
  )
}

export const UsersIndex = () => {
  const [open, setOpen] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [alert, setAlert] = useState<SnackbarState | undefined>(undefined)
  const { getUsers } = useUsers()

  useEffect(() => {
    updateUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const userData = useMemo(() => {
    return users.map((user: User): UserIndexTableData => {
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
      }
    })
  }, [users])

  const updateUsers = () => {
    getUsers()
      .then((response) => {
        setUsers(response.data.users)
      })
      .catch((e) => {
        setAlert({
          severity: 'error',
          message: e.response.data.message || e,
          doNotAutoDismiss: true,
        })
      })
  }

  return (
    <Box>
      <Tooltip title="Add User">
        <Button
          style={{ float: 'right' }}
          variant="contained"
          color="primary"
          aria-label="Add user"
          onClick={() => setOpen(true)}
        >
          <AddIcon />
        </Button>
      </Tooltip>
      <NewUserModal open={open} setOpen={setOpen} updateUsers={updateUsers} />
      <PageHeader title="User Management" description="" />
      <Divider />
      <Table
        tableKey="Users"
        data={userData}
        columns={useTableColumns()}
        showGlobalFilter
      />
      {alert ? <Snackbar status={alert} /> : null}
    </Box>
  )
}
