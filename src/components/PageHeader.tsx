import { Box, Typography } from '@mui/material'

interface PageHeaderProps {
  title: string
  description: string
}

const PageHeader = (
  {
    title,
    description
  }: PageHeaderProps
) => {
  return (
    <Box>
      <Box display="flex" alignItems="flex-end">
        <Box>
          <Typography variant="h4">{title}</Typography>
        </Box>
        <Box pl={1}>
          <Typography>{description}</Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default PageHeader
