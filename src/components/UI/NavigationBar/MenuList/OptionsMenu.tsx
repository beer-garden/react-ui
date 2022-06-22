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
import { ThemeChooser } from 'components/UI/Theme/ThemeChooser'
import * as React from 'react'
import {NavigationBarContext} from "../NavigationBarContext";

const OptionsMenu = () => {
  const [open, setOpen] = React.useState(false)

  const handleClick = () => setOpen(!open)

  const drawerIsOpen = React.useContext(NavigationBarContext).drawerIsOpen

  if(!drawerIsOpen && open){
    setOpen(drawerIsOpen)
  }

  return (
    <React.Fragment>
      <ListItemButton sx={{pl: 1}} onClick={handleClick}>
        <ListItemIcon>
          <SettingsIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary={'Options'} />
        {open ? <ExpandLessIcon fontSize="small"/> : <ExpandMoreIcon fontSize="small"/>}
      </ListItemButton>
      <Collapse in={open && drawerIsOpen} timeout={'auto'} unmountOnExit>
        <Divider />
        <ThemeChooser />
      </Collapse>
    </React.Fragment>
  )
}

export { OptionsMenu }
