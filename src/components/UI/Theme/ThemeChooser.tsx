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
import * as React from 'react'

import { ThemeContext } from './ThemeProvider'

const ThemeChooser = () => {
  const toggleDrawer = React.useContext(NavigationBarContext).toggleDrawer
  const { mode, setMode } = useColorScheme()
  const setTheme = React.useContext(ThemeContext).setTheme as (
    choice: SupportedColorScheme,
  ) => void

  const handleThemeChange = (event: React.KeyboardEvent | React.MouseEvent) => {
    const newMode: SupportedColorScheme = flip(mode)
    // validateThemeChoice(newMode)
    setMode(newMode)
    setTheme(newMode)
    toggleDrawer(false)(event)
  }

  const flip = (value: SupportedColorScheme): SupportedColorScheme => {
    let newMode: SupportedColorScheme
    value === 'dark' ? (newMode = 'light') : (newMode = 'dark')
    return newMode
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
