import { Box, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

interface ILabelData {
  label: string
  data?: string | number
  link?: string
}

/**
 * Reusable component that makes a labeled data display field. Similar visually
 * to text input, but without any of the actions or border
 * @param label string Data label
 * @param data string | number Data to display
 * @param link string Url to use for 'to' in Link component
 * @returns
 */
const LabeledData = ({ label, data, link }: ILabelData) => {
  return (
    <Box>
      <Typography sx={{ my: 2 }} fontWeight={'bold'} variant="overline">
        {label}:
      </Typography>
      {link ? (
        <Typography variant="body1">
          <Link to={link} data-testid={`${label}Link`}>
            {data}
          </Link>
        </Typography>
      ) : (
        <Typography variant="body1">{data}</Typography>
      )}
    </Box>
  )
}

export { LabeledData }
