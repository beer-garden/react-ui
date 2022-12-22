import { DefaultCellRenderer } from 'components/Table/defaults'
import HiddenRenderer from 'components/Table/render/HiddenRenderer'
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
          accessor: 'command',
          Cell: HiddenRenderer,
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
          accessor: 'command',
          Cell: HiddenRenderer,
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
          Header: 'Action',
          accessor: 'executeButton',
          Cell: DefaultCellRenderer,
          disableSortBy: true,
          disableGroupBy: true,
          disableFilters: true,
          canHide: false,
          width: 95,
        },
      ]
    }
  }, [showExecute])
}

export { useCommandIndexTableColumns }
