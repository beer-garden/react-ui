import {
  Download as DownloadIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import {
  Alert,
  Backdrop,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  FormControlLabel,
  IconButton,
  Link,
  Switch,
  Typography,
} from '@mui/material'
import useAxios from 'axios-hooks'
import { Divider } from 'components/Divider'
import { PageHeader } from 'components/PageHeader'
import { ThemeContext } from 'components/UI/Theme/ThemeProvider'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { RequestViewTable } from 'pages/RequestView'
import {
  getParentLinks,
  outputFormatted,
} from 'pages/RequestView/requestViewHelpers'
import { useContext, useEffect, useState } from 'react'
import ReactJson from 'react-json-view'
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

  const [showAsRawData, setShowAsRawData] = useState(false)

  const pourItAgainClick = () => {
    // todo restore functionality of pass request data once command page has been refactored
  }

  const downloadUrl = window.URL.createObjectURL(
    new Blob([request?.output || '']),
  )

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
          <Box pt={4} display="flex" alignItems="flex-start">
            {!expandParameter ? (
              <Card sx={{ width: 1 }}>
                <CardActions>
                  <Typography style={{ flex: 1 }} variant="h6">
                    Output
                  </Typography>
                  {!['HTML', 'JSON'].includes(request.output_type) ? null : (
                    <FormControlLabel
                      control={
                        <Switch
                          color="secondary"
                          checked={!showAsRawData}
                          onChange={() => {
                            setShowAsRawData(!showAsRawData)
                          }}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      }
                      label="Formatted"
                    />
                  )}
                  <Link
                    href={downloadUrl}
                    download={`${request.id}.${
                      ['STRING', null].includes(request.output_type)
                        ? 'txt'
                        : request.output_type.toLowerCase()
                    }`}
                  >
                    <IconButton size="small" aria-label="expand">
                      <DownloadIcon />
                    </IconButton>
                  </Link>
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
                </CardActions>
                <Divider />
                <CardContent>
                  {outputFormatted(request, theme, showAsRawData)}
                </CardContent>
              </Card>
            ) : null}
            {!expandOutput ? (
              <Card sx={{ width: 1 }}>
                <CardActions>
                  <Typography style={{ flex: 1, float: 'right' }} variant="h6">
                    Parameters
                  </Typography>
                  <Typography>
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
                </CardActions>
                <Divider />
                <CardContent>
                  <ReactJson
                    src={request.parameters}
                    theme={theme === 'dark' ? 'bright' : 'rjv-default'}
                    style={{ backgroundColor: 'primary' }}
                  />
                </CardContent>
              </Card>
            ) : null}
          </Box>
        </>
      ) : error ? (
        <Alert severity="error">{error.message}</Alert>
      ) : (
        <Backdrop open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </>
  )
}

export { RequestView }
