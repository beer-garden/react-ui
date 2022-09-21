import { Box, Divider as MuiDivider } from '@mui/material'

const Divider = (): JSX.Element => {
  return (
    <Box pb={0}>
      <MuiDivider sx={{ my: 2 }} />
    </Box>
  )
}

export { Divider }
