import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material'
import SettingsIcon from '@mui/icons-material/Settings'
import {
  Collapse,
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import { NavigationBarContext } from 'components/UI/NavigationBar/NavigationBarContext'
import { ThemeChooser } from 'components/UI/Theme/ThemeChooser'
import { useMountedState } from 'hooks/useMountedState'
import { useContext } from 'react'

const OptionsMenu = () => {
  const [open, setOpen] = useMountedState<boolean>(false)
  const handleClick = () => setOpen(!open)
  const drawerIsOpen = useContext(NavigationBarContext).drawerIsOpen

  if (!drawerIsOpen && open) {
    setOpen(drawerIsOpen)
  }

  return (
    <>
      <ListItemButton sx={{ pl: 1 }} onClick={handleClick}>
        <ListItemIcon>
          <SettingsIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary={'Options'} />
        {open ? (
          <ExpandLessIcon fontSize="small" />
        ) : (
          <ExpandMoreIcon fontSize="small" />
        )}
      </ListItemButton>
      <Collapse in={open && drawerIsOpen} timeout={'auto'} unmountOnExit>
        <Divider />
        <ThemeChooser />
      </Collapse>
    </>
  )
}

export { OptionsMenu }
