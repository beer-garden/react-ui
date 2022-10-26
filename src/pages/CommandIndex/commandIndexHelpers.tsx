import { DefaultCellRenderer } from 'components/Table/defaults'
import { useMemo } from 'react'
import { Column } from 'react-table'
import { CommandIndexTableData } from 'types/custom-types'

const useCommandIndexTableColumns = (showExecute = false) => {
  return useMemo<Column<CommandIndexTableData>[]>(() => {
    if (!showExecute) {
      return [
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
          Cell: DefaultCellRenderer,
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
      ]
    } else {
      return [
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
          Cell: DefaultCellRenderer,
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
          accessor: 'executeButton',
          Cell: DefaultCellRenderer,
          disableSortBy: true,
          disableGroupBy: true,
          disableFilters: true,
          canHide: false,
          width: 95,
          minWidth: 75,
          maxWidth: 120,
        },
      ]
    }
  }, [showExecute])
}

export { useCommandIndexTableColumns }