import { CircularProgress, Typography } from '@mui/material'
import { ModalWrapper } from 'components/ModalWrapper'
import { Snackbar } from 'components/Snackbar'
import { Table } from 'components/Table'
import { DefaultCellRenderer } from 'components/Table/defaults'
import { SocketContainer } from 'containers/SocketContainer'
import useGardens from 'hooks/useGardens'
import { useMountedState } from 'hooks/useMountedState'
import { useEffect, useMemo } from 'react'
import { Column } from 'react-table'
import { Garden } from 'types/backend-types'
import {
  ObjectWithStringKeys,
  SnackbarState,
  SyncGarden,
  syncString,
} from 'types/custom-types'

interface ModalProps {
  open: boolean
  setOpen: (b: boolean) => void
}

interface UserSyncTableData extends ObjectWithStringKeys {
  garden: string
  sync: JSX.Element
}

const useTableColumns = () => {
  return useMemo<Column<UserSyncTableData>[]>(() => {
    return [
      {
        Header: 'Garden',
        accessor: 'garden',
        disableSortBy: true,
        disableGroupBy: true,
        disableFilters: true,
        canHide: false,
      },
      {
        Header: 'Sync Status',
        Cell: DefaultCellRenderer,
        accessor: 'sync',
        disableSortBy: true,
        disableGroupBy: true,
        disableFilters: true,
        canHide: false,
      },
    ]
  }, [])
}

const SyncUserModal = ({ open, setOpen }: ModalProps) => {
  const [gardens, setGardens] = useMountedState<SyncGarden[]>([])
  const [alert, setAlert] = useMountedState<SnackbarState | undefined>()

  const { getGardens, syncUsers } = useGardens()
  const { addCallback, removeCallback } = SocketContainer.useContainer()

  /**
   * Populate table data
   */
  const userData = useMemo(() => {
    return gardens.map((garden: SyncGarden): UserSyncTableData => {
      return {
        garden: garden.name,
        sync:
          garden.syncStatus === 'IN_PROGRESS' ? (
            <CircularProgress
              color="inherit"
              aria-label="Sync status in progress"
            />
          ) : (
            <Typography>{garden.syncStatus}</Typography>
          ),
      }
    })
  }, [gardens])

  useEffect(() => {
    addCallback('sync_users', (event) => {
      if (event.name === 'USERS_IMPORTED') {
        gardens.forEach((garden) => {
          if (garden.name === event.metadata.garden) {
            garden.syncStatus = 'COMPLETE'
          }
        })
      }
      setGardens(gardens)
    })
    return () => {
      removeCallback('sync_users')
    }
  }, [addCallback, gardens, removeCallback, setGardens])

  useEffect(() => {
    getGardens()
      .then((response) => {
        const gardenList: SyncGarden[] = []
        response.data.forEach((garden: Garden) => {
          if (garden.connection_type !== 'LOCAL') {
            if (garden.status !== 'RUNNING') {
              gardenList.push(
                Object.assign(
                  { syncStatus: 'NOT RUNNING' as syncString },
                  garden,
                ),
              )
            } else {
              gardenList.push(
                Object.assign({ syncStatus: 'PENDING' as syncString }, garden),
              )
            }
          }
        })
        setGardens(gardenList)
      })
      .catch((e) => {
        setAlert({
          severity: 'error',
          message: e.response?.data.message || e,
          doNotAutoDismiss: true,
        })
      })
  }, [getGardens, setAlert, setGardens])

  return (
    <>
      <ModalWrapper
        open={open}
        header="Sync Users"
        onClose={() => {
          setOpen(false)
        }}
        onCancel={() => {
          setOpen(false)
        }}
        onSubmit={() => {
          syncUsers()
            .then(() => {
              setAlert({
                severity: 'success',
                message: 'Users successfully synced!',
              })
              // TODO ? set syncStatus IN_PROGRESS for status = RUNNING
              setOpen(false)
            })
            .catch((e) => {
              setAlert({
                severity: 'error',
                message: e.response?.data.message || e,
                doNotAutoDismiss: true,
              })
            })
        }}
        styleOverrides={{ size: 'sm', top: '-55%' }}
        content={
          <>
            <Typography variant="body1">
              This will sync all users and roles from this garden to all remote
              gardens, making the role assignments and password for each user on
              the remote garden match those of the users for this garden. Any
              role assignments that were granted directly on the remote gardens
              will be overwritten by this process.
            </Typography>
            <Table
              tableKey="UserSync"
              data={userData}
              columns={useTableColumns()}
              hideToolbar
            />
          </>
        }
      />
      {alert ? <Snackbar status={alert} /> : null}
    </>
  )
}

export default SyncUserModal
