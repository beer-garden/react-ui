import { Box, MenuItem, Stack, TextField } from '@mui/material'
import { ConnectionFormFields } from 'components/GardenConnectionForm'
import { useFormikContext } from 'formik'

const ConnectionMethod = () => {
  const context = useFormikContext<ConnectionFormFields>()

  return (
    <Stack spacing={2}>
      <Box sx={{ mt: 1, mb: -2 }}>
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

export { ConnectionMethod }
