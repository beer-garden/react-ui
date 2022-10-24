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
  Link,
  Switch,
  Typography,
} from '@mui/material'
import { SupportedColorScheme } from '@mui/material/styles'
import { Divider } from 'components/Divider'
import { outputFormatted } from 'pages/RequestView/requestViewHelpers'
import { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'
import { Request } from 'types/backend-types'

interface RequestViewOutputProps {
  request: Request
  expandParameter: boolean
  expandOutput: boolean
  setExpandOutput: Dispatch<SetStateAction<boolean>>
  theme: SupportedColorScheme
}

const RequestViewOutput = ({
  request,
  expandParameter,
  expandOutput,
  setExpandOutput,
  theme,
}: RequestViewOutputProps) => {
  const [showAsRawData, setShowAsRawData] = useState(false)

  const downloadUrl = window.URL.createObjectURL(
    new Blob([request?.output || '']),
  )

  return (
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
          <IconButton size="small" aria-label="download output">
            <DownloadIcon />
          </IconButton>
        </Link>
        <IconButton
          size="small"
          onClick={() => setExpandOutput(!expandOutput)}
          aria-label="expand output"
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
  )
}

export { RequestViewOutput }
