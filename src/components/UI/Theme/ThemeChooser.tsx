import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SupportedColorScheme,
} from '@mui/material'
import { useColorScheme } from '@mui/material/styles'
import { NavigationBarContext } from 'components/UI/NavigationBar/NavigationBarContext'
import { useContext } from 'react'

import { ThemeContext } from './ThemeProvider'

const ThemeChooser = () => {
  const toggleDrawer = useContext(NavigationBarContext).toggleDrawer
  const { mode, setMode } = useColorScheme()
  const setTheme = useContext(ThemeContext).setTheme

  const handleThemeChange = (event: React.KeyboardEvent | React.MouseEvent) => {
    const newMode: SupportedColorScheme = flip(mode)
    setMode(newMode)
    setTheme(newMode)
    toggleDrawer(false)(event)
  }

  const flip = (value: SupportedColorScheme): SupportedColorScheme => {
    return value === 'dark' ? 'light' : 'dark'
  }

  return (
    <ListItemButton onClick={handleThemeChange} sx={{ pl: 3 }}>
      <ListItemIcon>
        {mode === 'dark' ? (
          <Brightness7Icon fontSize="small" />
        ) : (
          <Brightness4Icon fontSize="small" />
        )}
      </ListItemIcon>
      <ListItemText
        primary={
          flip(mode).charAt(0).toUpperCase() + flip(mode).slice(1) + ' mode'
        }
      />
    </ListItemButton>
  )
}

export { ThemeChooser }
