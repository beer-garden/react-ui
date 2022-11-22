import { Box } from '@mui/material'
import { RequestsIndexTableData } from 'pages/RequestsIndex/data'
import { Link as RouterLink } from 'react-router-dom'
import { Request } from 'types/backend-types'

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
      <RouterLink to={'/systems/' + params.join('/')}>{label}</RouterLink>
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
    command: request.command,
    namespace,
    system: system,
    version: systemVersion,
    instance: instanceName,
    status,
    created: createdDate.toISOString(),
    comment,
    id: request.id,
    hasParent: !!request.parent,
    isHidden: !!request.hidden,
    parentId: request.parent?.id,
    parentCommand: request.parent?.command,
    commandLink: request.parent
      ? `/requests/${request.parent?.id}`
      : request.hidden
      ? undefined
      : `/requests/${request.id}`,
    versionLink: `/systems/${namespace}/${system}/${systemVersion}`,
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

export { formatBeergardenRequests, SystemLink }
