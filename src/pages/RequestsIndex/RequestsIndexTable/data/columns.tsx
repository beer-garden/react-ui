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
        width: 150,
        maxWidth: 150,
        filter: 'fuzzyText',
        filterOrder: 0,
      },
      {
        Header: 'Namespace',
        accessor: 'namespace',
        width: 120,
        filter: 'fuzzyText',
        filterOrder: 1,
      },
      {
        Header: 'System',
        accessor: 'system',
        width: 150,
        filter: 'fuzzyText',
        filterOrder: 2,
      },
      {
        Header: 'Version',
        accessor: 'version',
        width: 120,
        filterOrder: 3,
      },
      {
        Header: 'Instance',
        accessor: 'instance',
        width: 100,
        filterOrder: 4,
      },
      {
        Header: 'Status',
        accessor: 'status',
        width: 100,
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
