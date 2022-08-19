import { CircularProgress } from '@mui/material'
import ReactJson from 'react-json-view'
import { Request } from 'types/backend-types'

const formatData = (requests: Request[]) => {
  const tempData: (string | JSX.Element | number | null)[][] = []
  for (const index in requests) {
    tempData[index] = [
      requests[index].instance_name,
      requests[index].status,
      new Date(requests[index].created_at as number).toString(),
      new Date(requests[index].updated_at as number).toString(),
      requests[index].comment,
    ]
  }
  return tempData
}

const outputFormatted = (request: Request) => {
  if (['SUCCESS', 'CANCELED', 'ERROR'].includes(request.status)) {
    const output = request.output || ''
    const output_type = request.output_type

    if (output_type === 'STRING') {
      return <span>{output}</span>
    } else if (output_type === 'JSON') {
      return <ReactJson src={JSON.parse(output || '')} />
    } else if (output_type === 'HTML') {
      return <div dangerouslySetInnerHTML={{ __html: output }} />
    }
  } else {
    return <CircularProgress color="inherit" />
  }
}

export { formatData, outputFormatted }
