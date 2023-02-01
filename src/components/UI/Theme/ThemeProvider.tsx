import {
  Experimental_CssVarsProvider as CssVarsProvider,
  SupportedColorScheme,
} from '@mui/material/styles'
import { getTheme } from 'components/UI/Theme/Theme'
import { useMountedState } from 'hooks/useMountedState'
import { createContext } from 'react'

type ThemeProviderContext = {
  theme: SupportedColorScheme
  setTheme: (choice: SupportedColorScheme) => void
}

const ThemeContext = createContext<ThemeProviderContext>({
  theme: 'dark',
  setTheme: () => {
    return
  },
})

const ThemeProvider = ({
  children,
}: React.PropsWithChildren<Record<never, never>>) => {
  const currentTheme = localStorage.getItem('bg-theme')
  const [theme, _setTheme] = useMountedState<SupportedColorScheme>(
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
