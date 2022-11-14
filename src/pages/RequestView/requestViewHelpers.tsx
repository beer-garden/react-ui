import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { Breadcrumbs, CircularProgress } from '@mui/material'
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

    if (!['HTML', 'JSON'].includes(output_type) || showAsRawData) {
      let parsed: string | number | boolean | object

      try {
        parsed = JSON.parse(output)
        parsed = JSON.stringify(parsed, null, 2)
      } catch (error) {
        parsed = output
      }

      return (
        <pre
          style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            overflow: 'auto',
          }}
        >
          {parsed}
        </pre>
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
        <RouterLink to={'/requests/' + request.id}>
          {request.command}
        </RouterLink>
      </Breadcrumbs>
    </>
  ) : (
    <RouterLink to={'/requests/' + request.id}>{request.command}</RouterLink>
  )
}

export { getParentLinks, outputFormatted }
