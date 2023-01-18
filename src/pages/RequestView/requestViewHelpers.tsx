import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { Breadcrumbs, CircularProgress } from '@mui/material'
import { SupportedColorScheme } from '@mui/material/styles'
import { sanitize } from 'dompurify'
import ReactJson from 'react-json-view'
import { Link as RouterLink } from 'react-router-dom'
import { Request } from 'types/backend-types'
import { darkTheme, lightTheme } from 'utils/customRJVThemes'

const outputFormatted = (
  request: Request,
  theme: SupportedColorScheme,
  bgColor: string,
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
          theme={theme === 'dark' ? darkTheme(bgColor) : lightTheme(bgColor)}
          style={{ backgroundColor: 'primary' }}
        />
      )
    } else if (output_type === 'HTML') {
      const template = sanitize(output, { ALLOWED_TAGS: ['script'] })
      return <div dangerouslySetInnerHTML={{ __html: template }} />
    }
  } else {
    return (
      <CircularProgress color="inherit" aria-label="Request data loading" />
    )
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
