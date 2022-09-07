import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { Breadcrumbs, CircularProgress, Typography } from '@mui/material'
import { SupportedColorScheme } from '@mui/material/styles'
import ReactJson from 'react-json-view'
import { Link as RouterLink } from 'react-router-dom'
import { Request } from 'types/backend-types'

const outputFormatted = (
  request: Request,
  theme: SupportedColorScheme,
  showAsRawData = false,
) => {
  if (['SUCCESS', 'CANCELED', 'ERROR'].includes(request.status)) {
    const output = request.output || ''
    const output_type = request.output_type

    if (output_type === 'STRING' || showAsRawData) {
      let parsed: string | number | boolean | object

      try {
        parsed = JSON.parse(output)
      } catch (error) {
        parsed = output
      }
      return (
        <span>
          <pre>{JSON.stringify(parsed, null, 2)}</pre>
        </span>
      )
    } else if (output_type === 'JSON') {
      return (
        <ReactJson
          src={JSON.parse(output)}
          theme={theme === 'dark' ? 'bright' : 'rjv-default'}
          style={{ backgroundColor: 'primary' }}
        />
      )
    } else if (output_type === 'HTML') {
      return <div dangerouslySetInnerHTML={{ __html: output }} />
    }
  } else {
    return <CircularProgress color="inherit" />
  }
}

const getParentLinks = (request: Request): JSX.Element => {
  return request.parent ? (
    <>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
        {getParentLinks(request.parent)}
        <Typography>{request.command}</Typography>
      </Breadcrumbs>
    </>
  ) : (
    <RouterLink to={'/requests/' + request.id}>{request.command}</RouterLink>
  )
}

export { getParentLinks, outputFormatted }
