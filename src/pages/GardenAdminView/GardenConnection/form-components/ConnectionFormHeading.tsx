import { Typography } from '@mui/material'

type ConnectionHeadingPropsType = {
  labelText: string
  sx: object
}

const ConnectionFormHeading = ({
  labelText,
  sx,
}: ConnectionHeadingPropsType) => (
  <Typography variant="subtitle1" sx={{ ...sx }}>
    {labelText}
  </Typography>
)

export default ConnectionFormHeading
