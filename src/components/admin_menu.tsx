import { Box, Button, Menu, MenuItem } from '@mui/material'
import { BaseSyntheticEvent, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'

const AdminMenuTabs = (): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event: BaseSyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box>
      <Button
        color="primary"
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        Admin
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          onClick={handleClose}
          component={RouterLink}
          to="/admin/systems"
        >
          Systems
        </MenuItem>
        <MenuItem
          onClick={handleClose}
          component={RouterLink}
          to="/admin/gardens"
        >
          Gardens
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default AdminMenuTabs
