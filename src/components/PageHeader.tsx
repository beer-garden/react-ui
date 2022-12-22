import { Box, Typography } from '@mui/material'

interface PageHeaderProps {
  title: string
  description: string
}

const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <Box display="flex" alignItems="flex-end">
      <Typography variant="h2">
        <b>{title}</b>
      </Typography>
      <Typography pl={1}>{description}</Typography>
    </Box>
  )
}

export { PageHeader }
