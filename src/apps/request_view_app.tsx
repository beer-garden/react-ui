import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material'
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
} from '@mui/material'
import { AxiosResponse } from 'axios'
import { FC, useState } from 'react'
import ReactJson from 'react-json-view'
import { Link as RouterLink, useParams } from 'react-router-dom'
import Breadcrumbs from '../components/breadcrumbs'
import Divider from '../components/divider'
import PageHeader from '../components/page_header'
import RequestsTable from '../components/table'
import { Request, TableState } from '../custom_types/custom_types'
import CacheService from '../services/cache_service'
import RequestService from '../services/request_service'

const RequestViewApp: FC = () => {
  const [request, setRequest] = useState<Request>()
  const requestService = new RequestService()
  let filename = ''
  const parameterOutputWidth = 1
  const [expandOutput, setExpandOutput] = useState(false)
  const [expandParameter, setExpandParameter] = useState(false)
  const params = useParams()
  const { id } = params
  const state: TableState = {
    completeDataSet: [],
    formatData: formatData,
    includePageNav: false,
    disableSearch: true,
    tableHeads: ['Instance Name', 'Status', 'Created', 'Updated', 'Comment'],
  }
  const title = 'Request View'
  function formatData(requests: Request[]) {
    const tempData: (string | JSX.Element | number | null)[][] = []
    for (const i in requests) {
      tempData[i] = [
        requests[i].instance_name,
        requests[i].status,
        new Date(requests[i].created_at).toString(),
        new Date(requests[i].updated_at).toString(),
        requests[i].comment,
      ]
    }
    return tempData
  }

  function pourItAgainClick() {
    if (request) {
      CacheService.pushQueue(request, `lastKnownPourItAgainRequest`)
    }
  }

  function successCallback(response: AxiosResponse) {
    setRequest(response.data)
  }

  function outputFormatted(request: Request) {
    if (['SUCCESS', 'CANCELED', 'ERROR'].includes(request.status)) {
      const output = request.output
      const output_type = request.output_type
      if (output_type === 'STRING') {
        return <span>{output}</span>
      } else if (output_type === 'JSON') {
        return <ReactJson src={JSON.parse(output)} />
      } else if (output_type === 'HTML') {
        return <div dangerouslySetInnerHTML={{ __html: output }} />
      }
    } else {
      return <CircularProgress color="inherit" />
    }
  }

  function getExpandElement() {
    if (expandParameter || expandOutput) {
      return <ExpandLessIcon />
    } else {
      return <ExpandMoreIcon />
    }
  }

  function outputBox(request: Request) {
    if (!expandParameter) {
      return (
        <Box width={parameterOutputWidth}>
          <Grid justifyContent="space-between" container>
            <Grid item>
              <Typography variant="h6">Outputs</Typography>
            </Grid>
            <Grid item>
              <Typography style={{ flex: 1 }}>
                <IconButton
                  size="small"
                  onClick={() => setExpandOutput(!expandOutput)}
                  aria-label="expand"
                >
                  {getExpandElement()}
                </IconButton>
              </Typography>
            </Grid>
          </Grid>
          <Box
            border={1}
            borderColor="lightgrey"
            bgcolor="whitesmoke"
            borderRadius="borderRadius"
          >
            <Box p={2}>{outputFormatted(request)}</Box>
          </Box>
        </Box>
      )
    }
  }

  function parameterBox(request: Request) {
    if (!expandOutput) {
      return (
        <Box
          pl={1}
          width={parameterOutputWidth}
          style={{ verticalAlign: 'top' }}
        >
          <Grid justifyContent="space-between" container>
            <Grid item>
              <Typography variant="h6">Parameters</Typography>
            </Grid>
            <Grid item>
              <Typography style={{ flex: 1 }}>
                <IconButton
                  size="small"
                  onClick={() => setExpandParameter(!expandParameter)}
                  aria-label="start"
                >
                  {getExpandElement()}
                </IconButton>
              </Typography>
            </Grid>
          </Grid>
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
      )
    }
  }

  function renderComponents() {
    if (request) {
      return (
        <div>
          <Breadcrumbs
            breadcrumbs={[
              request.namespace,
              request.system,
              request.system_version,
              request.command,
              '',
            ]}
          />
          <RequestsTable parentState={state} />
          <Box pt={4} display="flex" alignItems="flex-start">
            {outputBox(request)}
            {parameterBox(request)}
          </Box>
        </div>
      )
    } else {
      return (
        <Backdrop open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )
    }
  }

  // function getButton() {
  //   if (request) {
  //     return (
  //       <Button
  //         component={RouterLink}
  //         to={{
  //           pathname: [
  //             '/systems',
  //             request.namespace,
  //             request.system,
  //             request.system_version,
  //             'commands',
  //             request.command,
  //           ].join('/'),
  //           state: { request: request },
  //         }}
  //         variant="contained"
  //         color="primary"
  //         onAuxClick={() => {
  //           pourItAgainClick()
  //         }}
  //         onClick={() => {
  //           pourItAgainClick()
  //         }}
  //       >
  //         Pour it Again
  //       </Button>
  //     )
  //   }
  // }
  function getButton() {
    if (request) {
      return (
        <Button
          component={RouterLink}
          to={[
            '/systems',
            request.namespace,
            request.system,
            request.system_version,
            'commands',
            request.command,
          ].join('/')}
          variant="contained"
          color="primary"
          onAuxClick={pourItAgainClick}
          onClick={pourItAgainClick}
        >
          Pour it Again
        </Button>
      )
    }
  }

  if (request) {
    if (request.output_type === 'STRING') {
      filename = id + '.txt'
    } else if (request.output_type === 'HTML') {
      filename = id + '.html'
    } else if (request.output_type === 'JSON') {
      filename = id + '.json'
    }
    state.completeDataSet = [request]
  } else {
    requestService.getRequest(successCallback, String(id))
  }

  return (
    <Box>
      <Grid justifyContent="space-between" container>
        <Grid item>
          <PageHeader title={title} description={String(id)} />
        </Grid>
        <Grid item>
          <Typography style={{ flex: 1 }}>{getButton()}</Typography>
        </Grid>
      </Grid>
      <Divider />
      {renderComponents()}
    </Box>
  )
}

export default RequestViewApp
