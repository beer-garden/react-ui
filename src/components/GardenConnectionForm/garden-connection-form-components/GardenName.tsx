import { Box, Stack, TextField } from '@mui/material'
import { useFormikContext } from 'formik'
import { ConnectionFormFields } from 'types/garden-connection-form-types'

const GardenName = () => {
  const context = useFormikContext<ConnectionFormFields>()

  return (
    <Stack spacing={2}>
      <Box sx={{ mt: 1, mb: -2 }}>
        <TextField
          variant="standard"
          required
          name="gardenName"
          label="Garden Name"
          value={context.values.gardenName}
          onChange={context.handleChange}
          helperText="Enter garden name"
          sx={{ width: '25%', m: 1 }}
        />
      </Box>
    </Stack>
  )
}

export { GardenName }
