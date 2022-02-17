import Typography from '@mui/material/Typography'
import { FC } from 'react'

type ConnectionHeadingPropsType = {
  labelText: string
  sx: object
}

const ConnectionFormHeading: FC<ConnectionHeadingPropsType> = ({
  labelText,
  sx,
}) => (
  <Typography variant="subtitle1" sx={{ ...sx }}>
    {labelText}
  </Typography>
)

export default ConnectionFormHeading
