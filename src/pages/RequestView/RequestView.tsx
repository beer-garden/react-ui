import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material'
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Typography,
} from '@mui/material'
import useAxios from 'axios-hooks'
import Breadcrumbs from 'components/Breadcrumbs'
import PageHeader from 'components/PageHeader'
import RequestsTable from 'components/table'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import {
  formatData,
  outputFormatted,
} from 'pages/RequestView/requestViewHelpers'
import { Fragment, useEffect, useState } from 'react'
import ReactJson from 'react-json-view'
import { Link as RouterLink, useParams } from 'react-router-dom'
import CacheService from 'services/cache_service'
import { Request, TableState } from 'types/custom_types'

interface RequestVariables {
  namespace: string
  system: string
  systemVersion: string
  command: string
}

const defaultVariables: RequestVariables = {
  namespace: '',
  system: '',
  systemVersion: '',
  command: '',
}

const RequestView = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const [request, setRequest] = useState<Request>()
  const [variables, setVariables] = useState<RequestVariables>(defaultVariables)
  const [expandOutput, setExpandOutput] = useState(false)
  const [expandParameter, setExpandParameter] = useState(false)
  const { id } = useParams()

  const [{ data, error }] = useAxios({
    url: '/api/v1/requests/' + id,
    method: 'get',
    withCredentials: authEnabled,
  })
  useEffect(() => {
    if (data && !error) {
      setRequest(data)
      setVariables({
        namespace: data.namespace,
        system: data.system,
        systemVersion: data.system_version,
        command: data.command,
      })
    }
  }, [data, error])

  const { namespace, system, systemVersion, command } = variables

  const state: TableState = {
    completeDataSet: [request as Request],
    formatData: formatData,
    includePageNav: false,
    disableSearch: true,
    tableHeads: ['Instance Name', 'Status', 'Created', 'Updated', 'Comment'],
  }

  const pourItAgainClick = () => {
    if (request) {
      CacheService.pushQueue(request, 'lastKnownPourItAgainRequest')
    }
  }

  return (
    <Fragment>
      <Typography style={{ flex: 1, float: 'right' }}>
        <Button
          component={RouterLink}
          to={[
            '/systems',
            namespace,
            system,
            systemVersion,
            'commands',
            command,
          ].join('/')}
          variant="contained"
          color="primary"
          onAuxClick={pourItAgainClick}
          onClick={pourItAgainClick}
        >
          Pour it Again
        </Button>
      </Typography>
      <PageHeader title="Request View" description={String(id)} />
      <Divider />
      {request ? (
        <>
          <Breadcrumbs
            breadcrumbs={[namespace, system, systemVersion, command, '']}
          />
          <RequestsTable parentState={state} />
          <Box pt={4} display="flex" alignItems="flex-start">
            {!expandParameter ? (
              <Box width={1}>
                <Typography style={{ flex: 1, float: 'right' }}>
                  <IconButton
                    size="small"
                    onClick={() => setExpandOutput(!expandOutput)}
                    aria-label="expand"
                  >
                    {expandParameter || expandOutput ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </IconButton>
                </Typography>
                <Typography variant="h6">Outputs</Typography>
                <Box
                  border={1}
                  borderColor="lightgrey"
                  bgcolor="whitesmoke"
                  borderRadius="borderRadius"
                >
                  <Box p={2}>{outputFormatted(request)}</Box>
                </Box>
              </Box>
            ) : null}
            {!expandOutput ? (
              <Box pl={1} width={1} style={{ verticalAlign: 'top' }}>
                <Typography style={{ flex: 1, float: 'right' }}>
                  <IconButton
                    size="small"
                    onClick={() => setExpandParameter(!expandParameter)}
                    aria-label="start"
                  >
                    {expandParameter || expandOutput ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </IconButton>
                </Typography>
                <Typography variant="h6">Parameters</Typography>
                <Box
                  border={1}
                  borderColor="lightgrey"
                  bgcolor="whitesmoke"
                  borderRadius="borderRadius"
                >
                  <Box p={2}>
                    <ReactJson src={request.parameters} />
                  </Box>
                </Box>
              </Box>
            ) : null}
          </Box>
        </>
      ) : (
        <Backdrop open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </Fragment>
  )
}

export { RequestView }
