import { Box } from '@mui/material'
import { DynamicModel } from 'pages/CommandView/dynamic-form'
import { useMemo } from 'react'
import ReactJson from 'react-json-view'

interface ModelPreviewProps {
  getData: () => DynamicModel
}

const ModelPreview = ({ getData }: ModelPreviewProps) => {
  const model = useMemo(() => getData(), [getData])

  return (
    <Box pl={1} width={2 / 5} style={{ verticalAlign: 'top' }}>
      <h3>Preview</h3>
      <ReactJson src={model} />
    </Box>
  )
}

export { ModelPreview }
