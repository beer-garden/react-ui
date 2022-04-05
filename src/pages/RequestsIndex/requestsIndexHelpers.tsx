import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight'
import { Box } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import {
  Request,
  RequestSearchApiColumn,
  RequestSearchApiOrder,
  RequestsSearchApi,
} from '../../types/custom_types'

const tableHeads = [
  'Command',
  'Namespace',
  'System',
  'Version',
  'Instance',
  'Status',
  'Created',
  'Comment',
]

const formatRequests = (requests: Request[]) => requests.map(requestToFormatted)

const requestToFormatted = (request: Request) => {
  const {
    namespace,
    system,
    system_version: systemVersion,
    instance_name: instanceName,
    status,
    created_at: createdAt,
    comment,
  } = request

  return [
    RequestLink(request),
    namespace,
    system,
    SystemLink(systemVersion, [namespace, system, systemVersion]),
    instanceName,
    status,
    new Date(createdAt).toString(),
    comment,
  ]
}

const RequestLink = (request: Request) => {
  return request.parent ? (
    <Box>
      <RouterLink to={'/requests/' + request.parent.id}>
        <SubdirectoryArrowRightIcon />
      </RouterLink>
      <RouterLink to={'/requests/' + request.id}>{request.command}</RouterLink>
    </Box>
  ) : (
    <RouterLink to={'/requests/' + request.id}>{request.command}</RouterLink>
  )
}

const SystemLink = (label: string, params: string[]) => {
  return <RouterLink to={'/systems' + params.join('/')}>{label}</RouterLink>
}

const baseSearchApi: RequestsSearchApi = {
  columns: [
    {
      data: 'command',
      name: '',
      searchable: true,
      orderable: true,
      search: { value: '', regex: false },
    },
    {
      data: 'namespace',
      name: '',
      searchable: true,
      orderable: true,
      search: { value: '', regex: false },
    },
    {
      data: 'system',
      name: '',
      searchable: true,
      orderable: true,
      search: { value: '', regex: false },
    },
    {
      data: 'system_version',
      name: '',
      searchable: true,
      orderable: true,
      search: { value: '', regex: false },
    },
    {
      data: 'instance_name',
      name: '',
      searchable: true,
      orderable: true,
      search: { value: '', regex: false },
    },
    {
      data: 'status',
      name: '',
      searchable: true,
      orderable: true,
      search: { value: '', regex: false },
    },
    {
      data: 'created_at',
      name: '',
      searchable: true,
      orderable: true,
      search: { value: '', regex: false },
    },
    {
      data: 'comment',
      name: '',
      searchable: true,
      orderable: true,
      search: { value: '', regex: false },
    },
    {
      data: 'metadata',
      name: '',
      searchable: true,
      orderable: true,
      search: { value: '', regex: false },
    },
    { data: 'id' },
    { data: 'parent' },
  ],
  draw: 1,
  include_children: false,
  length: 5,
  order: [{ column: 6, dir: 'desc' }],
  search: { value: '', regex: false },
  start: 0,
}

const getBaseSearchApi = (includeChildren: boolean): RequestsSearchApi => {
  return {
    ...baseSearchApi,
    include_children: includeChildren,
  }
}

const updateUrlFromColumn = (
  url: string,
  key: string,
  column: RequestSearchApiColumn[] | RequestSearchApiOrder[]
) => {
  let newUrl = url
  for (const colKey in column) {
    newUrl = newUrl.concat(key, '=', JSON.stringify(column[colKey]), '&')
  }
  return newUrl
}

const getUrlFromSearchApi = (searchApi: RequestsSearchApi) => {
  let url = '/api/v1/requests?'

  for (const key in searchApi) {
    if (key === 'columns' || key === 'order') {
      url = updateUrlFromColumn(
        url,
        key,
        searchApi[key] as RequestSearchApiColumn[] | RequestSearchApiOrder[]
      )
    } else if (key === 'search') {
      url = url.concat('search=', JSON.stringify(searchApi[key]))
    } else if (
      key === 'draw' ||
      key === 'include_children' ||
      key === 'length' ||
      key === 'start'
    ) {
      url = url + key + '=' + JSON.stringify(searchApi[key])
    }
    if (key !== 'start' && key !== 'columns' && key !== 'order') {
      url = url.concat('&')
    }
  }

  return url
    .replace('{', '%7B')
    .replace('}', '%7D')
    .concat('&timestamp=', new Date().getTime().toString())
}

export {
  tableHeads,
  getBaseSearchApi,
  formatRequests,
  baseSearchApi,
  getUrlFromSearchApi,
}
