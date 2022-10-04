import LogoutIcon from '@mui/icons-material/Logout'
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { AuthContainer } from 'containers/AuthContainer'

const LogoutButton = () => {
    const { logout } = AuthContainer.useContainer()

    return (
      <ListItemButton onClick={logout} sx={{ pl: 1 }}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary={'Logout'} />
      </ListItemButton>
    )
  
}
export { LogoutButton }
