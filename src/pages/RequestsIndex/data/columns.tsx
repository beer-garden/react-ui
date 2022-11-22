import {
  DateRangeColumnFilter,
  SelectionColumnFilter,
} from 'components/Table/filters'
import CommandIconsRenderer from 'components/Table/render/CommandIconsRenderer'
import { RequestsIndexTableData } from 'pages/RequestsIndex/data'
import { useMemo } from 'react'
import { Column } from 'react-table'

const useRequestsIndexTableColumns = () => {
  return useMemo<Column<RequestsIndexTableData>[]>(
    () => [
      {
        Header: 'Command',
        Cell: CommandIconsRenderer,
        accessor: 'command',
        linkKey: 'commandLink',
        width: 120,
        maxWidth: 120,
        minWidth: 95,
        filter: 'fuzzyText',
      },
      {
        Header: 'Namespace',
        accessor: 'namespace',
        minWidth: 120,
        maxWidth: 140,
        width: 130,
        filter: 'fuzzyText',
      },
      {
        Header: 'System',
        accessor: 'system',
        minWidth: 95,
        maxWidth: 140,
        width: 90,
        filter: 'fuzzyText',
      },
      {
        Header: 'Version',
        accessor: 'version',
        linkKey: 'versionLink',
        minWidth: 95,
        maxWidth: 120,
        width: 100,
      },
      {
        Header: 'Instance',
        accessor: 'instance',
        minWidth: 95,
        maxWidth: 120,
        width: 100,
      },
      {
        Header: 'Status',
        accessor: 'status',
        width: 95,
        Filter: SelectionColumnFilter,
        filter: 'includes',
        isWide: true,
        selectionOptions: [
          'SUCCESS',
          'ERROR',
          'CREATED',
          'RECEIVED',
          'IN PROGRESS',
          'CANCELED',
        ],
      },
      {
        Header: 'Created',
        accessor: 'created',
        filter: 'betweenDates',
        width: 235,
        Filter: DateRangeColumnFilter,
      },
      {
        Header: 'Comment',
        accessor: 'comment',
        width: 250,
      },
    ],
    [],
  )
}

export { useRequestsIndexTableColumns }
