import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import * as React from 'react'
import { getTheme, ThemeChoice, validateThemeChoice } from './getTheme'

interface ThemeContextType {
  currentTheme: ThemeChoice
  setTheme?: (choice: ThemeChoice) => void
}

export const ThemeContext = React.createContext<ThemeContextType>({
  currentTheme: 'dark',
  setTheme: undefined,
})

const ThemeProvider = ({
  children,
}: React.PropsWithChildren<Record<never, never>>) => {
  const [themeName, _setThemeName] = React.useState<ThemeChoice>(currentTheme())
  const theme = getTheme(themeName)

  const setThemeName = (theName: ThemeChoice) => {
    localStorage.setItem('bg-theme', theName)
    _setThemeName(theName)
  }

  const contextValue = {
    currentTheme: themeName,
    setTheme: setThemeName,
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  )
}

const currentTheme = (): ThemeChoice => {
  const themeName = localStorage.getItem('bg-theme')

  if (themeName) {
    try {
      validateThemeChoice(themeName)
      return themeName
    } catch (error) {
      console.error(error)
      return 'light'
    }
  } else {
    return 'light'
  }
}

export default ThemeProvider
