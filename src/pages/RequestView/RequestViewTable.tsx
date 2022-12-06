import { InfoOutlined } from '@mui/icons-material'
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
} from '@mui/icons-material'
import { Card, Divider, IconButton, Tooltip, Typography } from '@mui/material'
import { Table } from 'components/Table'
import {
  DateRangeColumnFilter,
  SelectionColumnFilter,
} from 'components/Table/filters'
import CommandIconsRenderer from 'components/Table/render/CommandIconsRenderer'
import { useRequestsIndexTableColumns } from 'pages/RequestsIndex'
import { useState } from 'react'
import { useMemo } from 'react'
import { Column } from 'react-table'
import { Request } from 'types/backend-types'
import { RequestsViewTableData } from 'types/request-types'
import { formatBeergardenRequests } from 'utils/dataHelpers'
import { dateFormatted } from 'utils/date-formatter'

interface RequestViewTableProps {
  request: Request
}

const RequestViewTable = ({ request }: RequestViewTableProps) => {
  let statusMsg: string | JSX.Element = ''
  switch (request.status) {
    case 'SUCCESS':
      statusMsg = 'The request has completed successfully'
      break
    case 'IN_PROGRESS':
      statusMsg =
        'The request has been received by the plugin and is actively being processed.'
      break
    case 'ERROR':
      statusMsg = (
        <>
          <b>Error Type:</b> {request.error_class}
          <br />
          The request encountered an error during processing and will not be
          reprocessed.
        </>
      )
      break
    case 'CREATED':
      statusMsg =
        'The request has been validated by beer-garden and is on the queue awaiting processing.'
      break
    case 'CANCELED':
      statusMsg = 'The request has been canceled and will not be processed.'
      break
    case 'RECEIVED':
      statusMsg =
        'The request has been received by beer-garden and is on the awaiting creation.'
      break
  }

  const [showChildren, setShowChildren] = useState(false)

  const useRequestViewTableColumns = () => {
    return useMemo<Column<RequestsViewTableData>[]>(
      () => [
        {
          Header: 'Command',
          accessor: 'command',
          Cell: CommandIconsRenderer,
          linkKey: 'commandLink',
          width: 120,
          maxWidth: 120,
          minWidth: 95,
          filter: 'fuzzyText',
        },
        {
          Header: 'Namespace',
          accessor: 'namespace',
          linkKey: 'namespaceLink',
          minWidth: 120,
          maxWidth: 140,
          width: 130,
          filter: 'fuzzyText',
        },
        {
          Header: 'System',
          accessor: 'system',
          linkKey: 'systemLink',
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
          Header: (
            <>
              {'Status '}
              <Tooltip
                arrow
                placement="right"
                title={
                  <>
                    <Typography>
                      <b>{request.status}</b>
                    </Typography>
                    <Divider />
                    <Typography>{statusMsg}</Typography>
                  </>
                }
              >
                <InfoOutlined fontSize="small" />
              </Tooltip>
            </>
          ),
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
          Header: 'Updated',
          accessor: 'updated',
          width: 235,
        },
      ],
      [],
    )
  }

  const childColumns = useRequestsIndexTableColumns()

  const childData = formatBeergardenRequests(request.children)

  const data: RequestsViewTableData[] = [
    {
      command: request.command,
      namespace: request.namespace,
      system: request.system,
      version: request.system_version,
      created: dateFormatted(new Date(request.created_at)),
      instance: request.instance_name,
      status: request.status,
      updated: dateFormatted(new Date(request.updated_at)),
      commandLink: `/systems/${request.namespace}/${request.system}/${request.system_version}/commands/${request.command}`,
      systemLink: `/systems/${request.namespace}/${request.system}`,
      namespaceLink: `/systems/${request.namespace}`,
      versionLink: `/systems/${request.namespace}/${request.system}/${request.system_version}`,
    },
  ]

  return (
    <>
      <Table
        tableKey={`${request.id}RequestIndex`}
        data={data}
        columns={useRequestViewTableColumns()}
        hideToolbar={true}
        hidePagination={true}
        hideSort={true}
      />
      {request.comment ? (
        <Card>
          <b>Comment:</b>
          <br />
          {request.comment}
        </Card>
      ) : null}
      {request.children[0] ? (
        <>
          <Divider />
          <Typography variant="h6">
            <IconButton
              onClick={() => {
                setShowChildren(!showChildren)
              }}
            >
              {showChildren ? (
                <KeyboardArrowDownIcon />
              ) : (
                <KeyboardArrowRightIcon />
              )}
              Children
            </IconButton>
          </Typography>
          {showChildren ? (
            <Table
              tableName={`${request.id}Children`}
              data={childData}
              hideToolbar={true}
              columns={childColumns}
            />
          ) : null}
        </>
      ) : null}
    </>
  )
}

export { RequestViewTable }
