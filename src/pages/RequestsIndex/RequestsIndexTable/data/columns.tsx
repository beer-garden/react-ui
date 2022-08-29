import { SelectionColumnFilter } from 'components/Table/filters'
import DateRangeColumnFilter from 'components/Table/filters/DateRangeColumnFilter'
import { RequestsIndexTableData } from 'pages/RequestsIndex/RequestsIndexTable/data'
import { useMemo } from 'react'
import { Column } from 'react-table'

const useRequestsIndexTableColumns = () => {
  return useMemo<Column<RequestsIndexTableData>[]>(
    () => [
      {
        Header: 'Command',
        accessor: 'command',
        width: 120,
        maxWidth: 120,
        minWidth: 95,
        filter: 'fuzzyText',
        filterOrder: 0,
      },
      {
        Header: 'Namespace',
        accessor: 'namespace',
        minWidth: 120,
        maxWidth: 140,
        width: 130,
        filter: 'fuzzyText',
        filterOrder: 1,
      },
      {
        Header: 'System',
        accessor: 'system',
        minWidth: 95,
        maxWidth: 140,
        width: 90,
        filter: 'fuzzyText',
        filterOrder: 2,
      },
      {
        Header: 'Version',
        accessor: 'version',
        minWidth: 95,
        maxWidth: 120,
        width: 100,
        filterOrder: 3,
      },
      {
        Header: 'Instance',
        accessor: 'instance',
        minWidth: 95,
        maxWidth: 120,
        width: 100,
        filterOrder: 4,
      },
      {
        Header: 'Status',
        accessor: 'status',
        width: 95,
        Filter: SelectionColumnFilter,
        filter: 'includes',
        isWide: true,
        filterOrder: 6,
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
        isWide: true,
        filterOrder: 7,
      },
      {
        Header: 'Comment',
        accessor: 'comment',
        width: 250,
        filterOrder: 5,
      },
    ],
    [],
  )
}

export { useRequestsIndexTableColumns }
