import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { ListItemButton, ListItemIcon,ListItemText } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { NavigationBarContext } from 'components/UI/NavigationBar/NavigationBarContext'
import { ThemeChoice } from 'components/UI/Theme/getTheme'
import { ThemeContext } from 'components/UI/Theme/ThemeProvider'
import * as React from 'react'

const ThemeChooser = () => {
  const theme = useTheme()
  const { currentTheme, setTheme } = React.useContext(ThemeContext)
  const themeSetter = setTheme as (choice: ThemeChoice) => void
  const toggleDrawer = React.useContext(NavigationBarContext)

  const handleThemeChange = (event: React.KeyboardEvent | React.MouseEvent) => {
    if (currentTheme === 'dark') {
      themeSetter('light')
    } else {
      themeSetter('dark')
    }

    toggleDrawer(false)(event)
  }

  const flip = (value: ThemeChoice): string => {
    if (value === 'dark') return 'Light'
    return 'Dark'
  }

  return (
    <ListItemButton onClick={handleThemeChange} sx={{ pl: 4 }}>
      <ListItemIcon>
        {theme.palette.mode === 'dark' ? (
          <Brightness7Icon />
        ) : (
          <Brightness4Icon />
        )}
      </ListItemIcon>
      <ListItemText primary={flip(theme.palette.mode) + ' mode'} />
    </ListItemButton>
  )
}

export { ThemeChooser }
