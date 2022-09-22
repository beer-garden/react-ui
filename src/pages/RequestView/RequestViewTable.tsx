import { InfoOutlined } from '@mui/icons-material'
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
} from '@mui/icons-material'
import { Card, Divider, IconButton, Tooltip, Typography } from '@mui/material'
import { Table } from 'components/Table'
import { SelectionColumnFilter } from 'components/Table/filters'
import {
  formatBeergardenRequests,
  SystemLink,
  useRequestsIndexTableColumns,
} from 'pages/RequestsIndex/data'
import { useState } from 'react'
import { Request } from 'types/backend-types'

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

  const columns = [
    {
      Header: 'Command',
      accessor: 'command',
      width: 150,
      maxWidth: 150,
    },
    {
      Header: 'Namespace',
      accessor: 'namespace',
      width: 120,
    },
    {
      Header: 'System',
      accessor: 'system',
      width: 150,
    },
    {
      Header: 'Version',
      accessor: 'version',
      width: 120,
    },
    {
      Header: 'Instance',
      accessor: 'instance',
      width: 100,
    },
    {
      Header: (
        <>
          Status{' '}
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
      Filter: SelectionColumnFilter,
    },
    {
      Header: 'Created',
      accessor: 'created',
      width: 235,
    },
    {
      Header: 'Updated',
      accessor: 'updated',
      width: 235,
    },
  ]

  const childColumns = useRequestsIndexTableColumns()

  const childData = formatBeergardenRequests(request.children)

  const data = [
    {
      command: SystemLink(request.command, [
        request.namespace,
        request.system,
        request.system_version,
        `commands/${request.command}`,
      ]),
      namespace: SystemLink(request.namespace, [request.namespace]),
      system: SystemLink(request.system, [request.namespace, request.system]),
      version: SystemLink(request.system_version, [
        request.namespace,
        request.system,
        request.system_version,
      ]),
      created: new Date(request.created_at).toJSON(),
      instance: request.instance_name,
      status: request.status,
      updated: new Date(request.updated_at).toJSON(),
    },
  ]

  return (
    <>
      <Table
        tableName=""
        data={data}
        columns={columns}
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
              tableName="Children"
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
