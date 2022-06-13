import { darkTheme, lightTheme } from 'components/UI/Theme'

const themes = {
  dark: darkTheme,
  light: lightTheme,
} as const

type ThemeChoice = keyof typeof themes

function validateThemeChoice(choice: string): asserts choice is ThemeChoice {
  if (!(choice in themes)) throw Error('invalid theme choice')
}

const getTheme = (themeName: string) => {
  validateThemeChoice(themeName)
  return themes[themeName]
}

export { getTheme, type ThemeChoice, validateThemeChoice }
