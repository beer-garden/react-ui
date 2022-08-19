import { useMemo } from 'react'
import { Column } from 'react-table'
import { CommandIndexTableData } from 'types/custom-types'

const useCommandIndexTableColumns = () => {
  return useMemo<Column<CommandIndexTableData>[]>(
    () => [
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
        Header: 'Version',
        accessor: 'version',
        width: 120,
      },
      {
        Header: 'Command',
        accessor: 'name',
        width: 300,
      },
      {
        Header: 'Description',
        accessor: 'description',
        width: 300,
      },
      {
        Header: '',
        accessor: 'action',
        disableSortBy: true,
        disableGroupBy: true,
        disableFilters: true,
        canHide: false,
        width: 120,
      },
    ],
    [],
  )
}

export { useCommandIndexTableColumns }
