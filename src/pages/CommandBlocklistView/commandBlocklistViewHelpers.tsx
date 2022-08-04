import { useMemo } from 'react'
import { Column } from 'react-table'
import { CommandRow } from 'types/custom_types'

const useModalColumns = () => {
  return useMemo<Column<CommandRow>[]>(
    () => [
      {
        Header: 'Add',
        accessor: 'action',
        disableSortBy: true,
        disableGroupBy: true,
        disableFilters: true,
        canHide: false,
        width: 60,
      },
      {
        Header: 'Namespace',
        accessor: 'namespace',
        width: 150,
      },
      {
        Header: 'System',
        accessor: 'system',
        filter: 'fuzzyText',
        width: 150,
      },
      {
        Header: 'Command',
        accessor: 'name',
        width: 300,
      },
    ],
    [],
  )
}

const useTableColumns = () => {
  return useMemo<Column<CommandRow>[]>(
    () => [
      {
        Header: 'Namespace',
        accessor: 'namespace',
        width: 170,
      },
      {
        Header: 'System',
        accessor: 'system',
        filter: 'fuzzyText',
        width: 170,
      },
      {
        Header: 'Command',
        accessor: 'name',
        width: 320,
      },
      {
        Header: 'Status',
        accessor: 'status',
        width: 170,
      },
      {
        Header: '',
        accessor: 'action',
        disableSortBy: true,
        disableGroupBy: true,
        disableFilters: true,
        canHide: false,
        width: 85,
      },
    ],
    [],
  )
}

export { useModalColumns, useTableColumns }
