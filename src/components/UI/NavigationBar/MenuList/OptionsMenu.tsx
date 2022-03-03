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
import { FC, Fragment, KeyboardEvent, MouseEvent, useState } from 'react'
import ThemeChooser from '../../Theme/ThemeChooser'

interface OptionsMenuProps {
  toggleDrawer: (open: boolean) => (event: KeyboardEvent | MouseEvent) => void
}

const OptionsMenu: FC<OptionsMenuProps> = ({ toggleDrawer }) => {
  const [open, setOpen] = useState(false)

  const handleClick = () => setOpen(!open)

  return (
    <Fragment>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary={'Options'} />
        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItemButton>
      <Collapse in={open} timeout={'auto'} unmountOnExit>
        <Divider />
        <ThemeChooser toggleDrawer={toggleDrawer} />
      </Collapse>
    </Fragment>
  )
}

export default OptionsMenu
