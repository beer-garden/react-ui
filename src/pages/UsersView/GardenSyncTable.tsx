import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { Typography } from '@mui/material'
import { Table } from 'components/Table'
import { useMemo } from 'react'
import { Column } from 'react-table'
import { SyncStatus } from 'types/backend-types'
import { ObjectWithStringKeys } from 'types/custom-types'

interface UserIndexTableData extends ObjectWithStringKeys {
  name: string
  sync: JSX.Element
}

const useTableColumns = () => {
  return useMemo<Column<UserIndexTableData>[]>(
    () => [
      {
        Header: 'Garden',
        accessor: 'name',
        canHide: false,
      },
      {
        Header: 'Synced',
        accessor: 'sync',
        canHide: false,
        width: 75,
      },
    ],
    [],
  )
}

export const GardenSyncTable = ({ syncObj }: { syncObj: SyncStatus }) => {
  const userData = useMemo(() => {
    return Object.entries(syncObj).map((syncStatus) => {
      return {
        name: syncStatus[0],
        sync: syncStatus[1] ? (
          <CheckIcon color="success" />
        ) : (
          <CloseIcon color="error" />
        ),
      }
    })
  }, [syncObj])

  return (
    <>
      <Typography variant="h6">Sync Status</Typography>
      <Table
        tableName="Sync Status"
        tableKey="UserSync"
        data={userData}
        columns={useTableColumns()}
        hidePagination
        hideToolbar
      />
    </>
  )
}
