import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useFormikContext } from 'formik'
import { FC } from 'react'
import { ConnectionFormFields } from './ConnectionFormFields'

const ConnectionMethod: FC = () => {
  const context = useFormikContext<ConnectionFormFields>()

  return (
    <Stack spacing={2}>
      <Box sx={{ mt: 1, mb: -2 }}>
        <Typography variant="h6">Update Connection</Typography>
        <TextField
          variant="standard"
          select
          required
          name="connectionType"
          label="Connection method"
          value={context.values.connectionType}
          onChange={context.handleChange}
          helperText="Select the connection method"
          sx={{ width: '25%', m: 1 }}
        >
          <MenuItem value={'HTTP'}>HTTP</MenuItem>
          <MenuItem value={'STOMP'}>STOMP</MenuItem>
        </TextField>
      </Box>
    </Stack>
  )
}

export default ConnectionMethod
