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
import * as React from 'react'
import ThemeChooser from '../../Theme/ThemeChooser'

const OptionsMenu = () => {
  const [open, setOpen] = React.useState(false)

  const handleClick = () => setOpen(!open)

  return (
    <React.Fragment>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary={'Options'} />
        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItemButton>
      <Collapse in={open} timeout={'auto'} unmountOnExit>
        <Divider />
        <ThemeChooser />
      </Collapse>
    </React.Fragment>
  )
}

export default OptionsMenu
