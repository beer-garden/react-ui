import { InfoOutlined } from '@mui/icons-material'
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
} from '@mui/icons-material'
import {
  Box,
  Divider,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material'
import { Divider as MyDivider } from 'components/Divider'
import { LabeledData } from 'components/LabeledData'
import { Table } from 'components/Table'
import { useMountedState } from 'hooks/useMountedState'
import { useRequestsIndexTableColumns } from 'pages/RequestsIndex'
import { Request } from 'types/backend-types'
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

  const [showChildren, setShowChildren] = useMountedState<boolean>(false)

  const childColumns = useRequestsIndexTableColumns()
  const childData = formatBeergardenRequests(request.children)

  return (
    <Paper sx={{ backgroundColor: 'background.default' }} elevation={0}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, 280px)',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <LabeledData
          label="Command"
          data={request.command}
          link={`/systems/${request.namespace}/${request.system}/${request.system_version}/commands/${request.command}`}
        />
        <LabeledData
          label="Namespace"
          data={request.namespace}
          link={`/systems/${request.namespace}`}
        />
        <LabeledData
          label="System"
          data={request.system}
          link={`/systems/${request.namespace}/${request.system}`}
        />
        <LabeledData
          label="Version"
          data={request.system_version}
          link={`/systems/${request.namespace}/${request.system}/${request.system_version}`}
        />
        <LabeledData label="Instance" data={request.instance_name} />
        <LabeledData label="Status" data={request.status}>
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
        </LabeledData>
        <LabeledData
          label="Created"
          data={dateFormatted(new Date(request.created_at))}
        />
        <LabeledData
          label="Updated"
          data={dateFormatted(new Date(request.updated_at))}
        />
        {request.comment && (
          <Box sx={{ gridColumnStart: '1', gridColumnEnd: -1 }}>
            <LabeledData label="Comment" data={request.comment || ''} />
          </Box>
        )}
      </Box>
      {request.children[0] ? (
        <>
          <MyDivider />
          <Typography variant="h3">
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
    </Paper>
  )
}

export { RequestViewTable }
