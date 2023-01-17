import { Box } from '@mui/material'
import { JsonCard } from 'components/JsonCard'
import { DynamicModel } from 'pages/CommandView/dynamic-form'
import { CommandViewModel } from 'types/form-model-types'

interface JobRequestFormModelPreviewProps {
  data: CommandViewModel | DynamicModel
}

const JobRequestFormModelPreview = ({
  data,
}: JobRequestFormModelPreviewProps) => {
  return (
    <Box pl={1} width={2 / 5} style={{ verticalAlign: 'top' }}>
      <JsonCard title="Preview" data={data} />
    </Box>
  )
}

export { JobRequestFormModelPreview }
