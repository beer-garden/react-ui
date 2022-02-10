import React, { FC } from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

interface PageHeaderProps {
  title: string
  description: string
}

const PageHeader: FC<PageHeaderProps> = ({
  title,
  description,
}: PageHeaderProps) => {
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
