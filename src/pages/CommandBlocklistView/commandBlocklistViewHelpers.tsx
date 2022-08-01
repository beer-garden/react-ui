import { useMemo } from 'react'
import { Column } from 'react-table'
import { CommandRow } from 'types/custom_types'

const useModalColumns = () => {
  return useMemo<Column<CommandRow>[]>(
    () => [
      {
        Header: 'Add',
        accessor: 'action',
        width: 85,
      },
      {
        Header: 'Namespace',
        accessor: 'namespace',
        filter: 'fuzzyText',
      },
      {
        Header: 'System',
        accessor: 'system',
        filter: 'fuzzyText',
      },
      {
        Header: 'Command',
        accessor: 'name',
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
        filter: 'fuzzyText',
      },
      {
        Header: 'System',
        accessor: 'system',
        filter: 'fuzzyText',
      },
      {
        Header: 'Command',
        accessor: 'name',
      },
      {
        Header: 'Status',
        accessor: 'status',
        filter: 'fuzzyText',
      },
      {
        Header: '',
        accessor: 'action',
        width: 85,
      },
    ],
    [],
  )
}

export { useModalColumns, useTableColumns }
