import { useMemo } from 'react'
import { Column } from 'react-table'
import { CommandIndexTableData } from 'types/custom-types'

const useCommandIndexTableColumns = () => {
  return useMemo<Column<CommandIndexTableData>[]>(
    () => [
      {
        Header: 'Namespace',
        accessor: 'namespace',
        minWidth: 120,
        maxWidth: 180,
        width: 130,
      },
      {
        Header: 'System',
        accessor: 'system',
        filter: 'fuzzyText',
        minWidth: 90,
        maxWidth: 150,
        width: 110,
      },
      {
        Header: 'Version',
        accessor: 'version',
        minWidth: 90,
        maxWidth: 120,
        width: 100,
      },
      {
        Header: 'Command',
        accessor: 'name',
        minWidth: 90,
        maxWidth: 350,
        width: 300,
      },
      {
        Header: 'Description',
        accessor: 'description',
        minWidth: 90,
        maxWidth: 500,
        width: 300,
      },
      {
        Header: '',
        accessor: 'action',
        disableSortBy: true,
        disableGroupBy: true,
        disableFilters: true,
        canHide: false,
        width: 95,
        minWidth: 75,
        maxWidth: 120,
      },
    ],
    [],
  )
}

export { useCommandIndexTableColumns }
