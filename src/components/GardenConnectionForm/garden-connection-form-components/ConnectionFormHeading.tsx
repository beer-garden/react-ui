import { Typography } from '@mui/material'

type ConnectionHeadingPropsType = {
  labelText: string
  sx: object
}

const ConnectionFormHeading = ({
  labelText,
  sx,
}: ConnectionHeadingPropsType) => (
  <Typography variant="h4" sx={{ ...sx }}>
    {labelText}
  </Typography>
)

export { ConnectionFormHeading }
