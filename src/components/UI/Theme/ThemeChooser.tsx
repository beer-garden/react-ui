import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { FC, KeyboardEvent, MouseEvent, useContext } from 'react'
import { ThemeChoice } from './getTheme'
import { ThemeContext } from './ThemeProvider'

interface ThemeChooserProps {
  toggleDrawer: (open: boolean) => (event: KeyboardEvent | MouseEvent) => void
}

const ThemeChooser: FC<ThemeChooserProps> = ({ toggleDrawer }) => {
  const theme = useTheme()
  const { currentTheme, setTheme } = useContext(ThemeContext)
  const themeSetter = setTheme as (choice: ThemeChoice) => void

  const handleThemeChange = (event: KeyboardEvent | MouseEvent) => {
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

export default ThemeChooser
