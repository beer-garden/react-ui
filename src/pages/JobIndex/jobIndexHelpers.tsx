import { DefaultCellRenderer } from 'components/Table/defaults'
import { useMemo } from 'react'
import { Column } from 'react-table'
import { ObjectWithStringKeys } from 'types/custom-types'

export interface JobTableData extends ObjectWithStringKeys {
  name: JSX.Element
  status: string
  system: JSX.Element
  instance: string
  command: string
  nextRun: string
  success: number
  error: number
}

export const useJobColumns = () => {
  return useMemo<Column<JobTableData>[]>(
    () => [
      {
        Header: 'Name',
        Cell: DefaultCellRenderer,
        accessor: 'name',
        filter: 'fuzzyText',
        minWidth: 120,
        maxWidth: 180,
        width: 130,
      },
      {
        Header: 'Status',
        accessor: 'status',
        minWidth: 120,
        maxWidth: 180,
        width: 130,
      },
      {
        Header: 'System',
        Cell: DefaultCellRenderer,
        accessor: 'system',
        filter: 'fuzzyText',
        minWidth: 120,
        maxWidth: 180,
        width: 130,
      },
      {
        Header: 'Instance',
        accessor: 'instance',
        filter: 'fuzzyText',
        minWidth: 120,
        maxWidth: 180,
        width: 130,
      },
      {
        Header: 'Command',
        accessor: 'command',
        filter: 'fuzzyText',
        minWidth: 130,
        maxWidth: 180,
        width: 140,
      },
      {
        Header: 'Next Run Time',
        accessor: 'nextRun',
        minWidth: 200,
        maxWidth: 300,
        width: 250,
      },
      {
        Header: 'Success Count',
        accessor: 'success',
        minWidth: 120,
        maxWidth: 180,
        width: 145,
      },
      {
        Header: 'Error Count',
        accessor: 'error',
        minWidth: 120,
        maxWidth: 180,
        width: 130,
      },
    ],
    [],
  )
}
