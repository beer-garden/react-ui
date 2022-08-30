import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { Box, IconButton, Tooltip } from '@mui/material'

export const generateCommandName = (hidden: boolean, name: string) => {
    return hidden ? (
      <Tooltip title="hidden command" aria-label={name + ' (hidden)'}>
        <Box component="span">
          {name}
          <IconButton disabled>
            <VisibilityOffIcon color="disabled" fontSize="small" />
          </IconButton>
        </Box>
      </Tooltip>
    ) : (
      name
    )
  }
