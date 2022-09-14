import FileUploadIcon from '@mui/icons-material/FileUpload'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { Box, Tooltip, Typography } from '@mui/material'
import { RequestsIndexTableData } from 'pages/RequestsIndex/data'
import { Link as RouterLink } from 'react-router-dom'
import { Request } from 'types/backend-types'

const RequestLink = (request: Request) => {
  const hasParent = !!request.parent
  const isHidden = !!request.hidden
  const mainCommand = [
    <Box
      key={request.id + '_main_link'}
      sx={
        !hasParent && !isHidden
          ? {
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              width: '120px',
              display: 'block',
              overflow: 'hidden',
            }
          : {}
      }
    >
      <RouterLink to={'/requests/' + request.id}>{request.command}</RouterLink>
    </Box>,
  ]

  if (hasParent) {
    /* place an icon at the beginning */
    mainCommand.unshift(
      <Box key={request.id + '_parent_link'}>
        <RouterLink to={'/requests/' + request.parent?.id}>
          <Tooltip
            title={
              <>
                <Typography color="inherit">Link to parent</Typography>
                <em>{request.parent?.command}</em>
              </>
            }
            aria-label="link to parent command"
          >
            <FileUploadIcon fontSize="small" sx={{ mr: 0.5 }} />
          </Tooltip>
        </RouterLink>
      </Box>,
    )
  }

  if (isHidden) {
    /* place an icon at the end */
    mainCommand.push(
      <Tooltip
        key={request.id + '_hidden'}
        title="hidden command"
        aria-label="hidden command"
      >
        <Box>
          <VisibilityOffIcon color="disabled" fontSize="small" sx={{ ml: 1 }} />
        </Box>
      </Tooltip>,
    )
  }

  return (
    <Box
      component="div"
      sx={{
        display: 'inline-flex',
        alignItems: 'stretch',
        flexWrap: 'wrap',
      }}
    >
      {mainCommand}
    </Box>
  )
}

const SystemLink = (label: string, params: string[]) => {
  return (
    <Box
      sx={{
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        width: '120px',
        display: 'block',
        overflow: 'hidden',
      }}
    >
      {' '}
      <RouterLink to={'/systems' + params.join('/')}>{label}</RouterLink>
    </Box>
  )
}

const requestToFormatted = (request: Request): RequestsIndexTableData => {
  const {
    namespace,
    system,
    system_version: systemVersion,
    instance_name: instanceName,
    status,
    created_at: createdAt,
    comment,
  } = request

  const createdDate = new Date(createdAt)

  return {
    command: RequestLink(request),
    namespace,
    system: system,
    version: SystemLink(systemVersion, [namespace, system, systemVersion]),
    instance: instanceName,
    status,
    created: createdDate.toISOString(),
    comment,
  }
}

/**
 * Take a list of requests, as returned by the server, and return them in
 * the format suitable for table display.
 *
 * @param requests
 * @returns
 */
const formatBeergardenRequests = (
  requests: Request[],
): RequestsIndexTableData[] => {
  return requests.map(requestToFormatted)
}

export { formatBeergardenRequests }
