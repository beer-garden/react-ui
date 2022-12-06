import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import {
  Alert,
  Backdrop,
  Breadcrumbs,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material'
import useAxios from 'axios-hooks'
import { Divider } from 'components/Divider'
import { JsonCard } from 'components/JsonCard'
import { PageHeader } from 'components/PageHeader'
import { ThemeContext } from 'components/UI/Theme/ThemeProvider'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { SocketContainer } from 'containers/SocketContainer'
import { RequestViewOutput, RequestViewTable } from 'pages/RequestView'
import { getParentLinks } from 'pages/RequestView/requestViewHelpers'
import { useContext, useEffect, useState } from 'react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { Request } from 'types/backend-types'

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
  const theme = useContext(ThemeContext).theme
  const [request, setRequest] = useState<Request>()
  const [variables, setVariables] = useState<RequestVariables>(defaultVariables)
  const [expandOutput, setExpandOutput] = useState(false)
  const [expandParameter, setExpandParameter] = useState(false)
  const { id } = useParams()

  const { addCallback, removeCallback } = SocketContainer.useContainer()

  const [{ data, error }, refetch] = useAxios(
    {
      url: '/api/v1/requests/' + id,
      method: 'get',
      withCredentials: authEnabled,
    },
    { useCache: false },
  )

  useEffect(() => {
    addCallback('request complete', (event) => {
      if (event.name === 'REQUEST_COMPLETED' && event.payload?.id === id) {
        refetch()
      }
    })
    return () => {
      removeCallback('request complete')
    }
  }, [addCallback, id, refetch, removeCallback])

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

  const pourItAgainClick = () => {
    // todo restore functionality of pass request data once command page has been refactored
  }

  return (
    <>
      <Button
        style={{ float: 'right' }}
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
        disabled={!!error || !request}
        color="secondary"
        onAuxClick={pourItAgainClick}
        onClick={pourItAgainClick}
      >
        remake request
      </Button>
      <PageHeader title="Request View" description={String(id)} />
      <Divider />
      {request ? (
        <>
          {request.parent ? (
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
              {getParentLinks(request.parent)}
              <Typography>{request.command}</Typography>
            </Breadcrumbs>
          ) : null}
          <RequestViewTable request={request} />
          <Stack py={4} direction="row" spacing={2}>
            {!expandParameter ? (
              <RequestViewOutput
                request={request}
                expandParameter={expandParameter}
                expandOutput={expandOutput}
                setExpandOutput={setExpandOutput}
                theme={theme}
              />
            ) : null}
            {!expandOutput ? (
              <JsonCard
                title="Parameters"
                collapseHandler={() => {
                  setExpandParameter(!expandParameter)
                }}
                data={request.parameters}
                iconTrigger={expandParameter && expandOutput}
              />
            ) : null}
          </Stack>
        </>
      ) : error ? (
        <Alert severity="error">{error.message}</Alert>
      ) : (
        <Backdrop open={true}>
          <CircularProgress data-testid="dataLoading" color="inherit" />
        </Backdrop>
      )}
    </>
  )
}

export { RequestView }
