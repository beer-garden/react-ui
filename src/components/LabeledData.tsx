import { Alert, Box, Typography } from '@mui/material'
import { getSeverity } from 'pages/SystemAdmin'
import { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface ILabelData {
  label: string
  data?: string | number
  link?: string
  children?: ReactNode
  alert?: boolean
}

const alertStyle = {
  '& .MuiAlert-message': {
    padding: '0px',
  },
  py: 0.1,
}

/**
 * Reusable component that makes a labeled data display field. Similar visually
 * to text input, but without any of the actions or border
 * @param label string Data label
 * @param data string | number Data to display
 * @param link string Url to use for 'to' in Link component
 * @returns
 */
const LabeledData = ({ label, data, link, children, alert }: ILabelData) => {
  return (
    <Box>
      <Typography sx={{ my: 2 }} fontWeight={'bold'} variant="overline">
        {label}: {children}
      </Typography>
      {link ? (
        <Typography variant="body1">
          <Link to={link} replace data-testid={`${label}Link`}>
            {data}
          </Link>
        </Typography>
      ) : alert ? (
        <Alert
          sx={alertStyle}
          icon={false}
          variant="filled"
          severity={getSeverity(data as string)}
        >
          {data}
        </Alert>
      ) : (
        <Typography variant="body1">{data}</Typography>
      )}
    </Box>
  )
}

export { LabeledData }
