import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import {
  Backdrop,
  Breadcrumbs,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material'
import useAxios from 'axios-hooks'
import { Divider } from 'components/Divider'
import { ErrorAlert } from 'components/ErrorAlert'
import { JsonCard } from 'components/JsonCard'
import { PageHeader } from 'components/PageHeader'
import { ThemeContext } from 'components/UI/Theme/ThemeProvider'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { PermissionsContainer } from 'containers/PermissionsContainer'
import { SocketContainer } from 'containers/SocketContainer'
import { useMountedState } from 'hooks/useMountedState'
import { RequestViewOutput, RequestViewTable } from 'pages/RequestView'
import { RemakeRequestButton } from 'pages/RequestView'
import { getParentLinks } from 'pages/RequestView/requestViewHelpers'
import { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Request } from 'types/backend-types'

const RequestView = () => {
  const { hasPermission } = PermissionsContainer.useContainer()
  const { authEnabled } = ServerConfigContainer.useContainer()
  const theme = useContext(ThemeContext).theme
  const [request, setRequest] = useMountedState<Request | undefined>()
  const [expandOutput, setExpandOutput] = useMountedState<boolean>(false)
  const [expandParameter, setExpandParameter] = useMountedState<boolean>(false)
  const { id } = useParams()

  const { addCallback, removeCallback } = SocketContainer.useContainer()

  const [{ data, error }, refetch] = useAxios<Request>(
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
    }
  }, [data, error, setRequest])

  return request && !error ? (
    <>
      {hasPermission('job:create') && <RemakeRequestButton request={request} />}
      <PageHeader title="Request View" description={String(id)} />
      <Divider />
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
  ) : error?.response ? (
    <ErrorAlert
      statusCode={error.response.status}
      specific="request"
      errorMsg={error.response.statusText}
    />
  ) : (
    <Backdrop title={'dataLoading'} open={true}>
      <CircularProgress color="inherit" aria-label="Request data loading" />
    </Backdrop>
  )
}

export { RequestView }
