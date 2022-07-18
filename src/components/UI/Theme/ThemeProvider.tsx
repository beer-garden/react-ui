import {
  Experimental_CssVarsProvider as CssVarsProvider,
  SupportedColorScheme,
} from '@mui/material/styles'
import { getTheme } from 'components/UI/Theme/Theme'
import * as React from 'react'

type themeProviderContext = {
  theme: SupportedColorScheme
  setTheme?: (choice: SupportedColorScheme) => void
}

const ThemeContext = React.createContext<themeProviderContext>({
  theme: 'dark',
  setTheme: undefined,
})

const ThemeProvider = ({
  children,
}: React.PropsWithChildren<Record<never, never>>) => {
  const currentTheme = localStorage.getItem('bg-theme')
  const [theme, _setTheme] = React.useState<SupportedColorScheme>(
    currentTheme === 'dark' ? 'dark' : 'light',
  )
  const setTheme = (theme: SupportedColorScheme) => {
    localStorage.setItem('bg-theme', theme)
    _setTheme(theme)
  }
  return (
    <ThemeContext.Provider value={{ theme: theme, setTheme: setTheme }}>
      <CssVarsProvider theme={getTheme(theme)}>{children}</CssVarsProvider>
    </ThemeContext.Provider>
  )
}

export { ThemeContext, ThemeProvider }
