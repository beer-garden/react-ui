import {
  Download as DownloadIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material'
import {
  Card,
  CardActions,
  CardContent,
  FormControlLabel,
  IconButton,
  Switch,
  Typography,
} from '@mui/material'
import { SupportedColorScheme } from '@mui/material/styles'
import { useMountedState } from 'hooks/useMountedState'
import { outputFormatted } from 'pages/RequestView/requestViewHelpers'
import { Request } from 'types/backend-types'

interface RequestViewOutputProps {
  request: Request
  expandParameter: boolean
  expandOutput: boolean
  setExpandOutput: (arg0: boolean) => void
  theme: SupportedColorScheme
}

const RequestViewOutput = ({
  request,
  expandParameter,
  expandOutput,
  setExpandOutput,
  theme,
}: RequestViewOutputProps) => {
  const [showAsRawData, setShowAsRawData] = useMountedState<boolean>(false)
  const downloadUrl = window.URL.createObjectURL(
    new Blob([request?.output || '']),
  )

  return (
    <Card sx={{ width: 1 }}>
      <CardActions
        sx={{
          backgroundColor: 'primary.main',
          color: 'common.white',
        }}
      >
        <Typography style={{ flex: 1 }} color="common.white" variant="h3">
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
                inputProps={{ 'aria-label': 'Format control' }}
              />
            }
            label="Formatted"
          />
        )}
        <Typography color="common.white">
          <IconButton
            href={downloadUrl}
            download={`${request.id}.${
              ['STRING', null].includes(request.output_type)
                ? 'txt'
                : request.output_type.toLowerCase()
            }`}
            color="inherit"
            aria-label="download output"
          >
            <DownloadIcon />
          </IconButton>
        </Typography>
        <Typography color="common.white">
          <IconButton
            color="inherit"
            onClick={() => setExpandOutput(!expandOutput)}
            aria-label="expand output"
          >
            {expandParameter || expandOutput ? (
              <ExpandMoreIcon />
            ) : (
              <ExpandLessIcon />
            )}
          </IconButton>
        </Typography>
      </CardActions>
      <CardContent sx={{maxHeight: '700px', overflowY: 'auto' }} >
        {outputFormatted(request, theme, showAsRawData)}
      </CardContent>
    </Card>
  )
}

export { RequestViewOutput }
