// import { deepOrange } from '@mui/material/colors'
import {
  experimental_extendTheme,
  SupportedColorScheme,
} from '@mui/material/styles'

function getTheme(themeName: SupportedColorScheme) {
  // Main colors for dark theme
  const dtext = '#DEDEDE' // text
  const d1 = '#313B4D' // background
  const d6 = '#3B404A' // paper & App bar
  const d2 = '#3F51B5' // primary, same as MUI primary
  const d3 = '#8EB7E6' // secondary
  const d4 = '#2a2d34' // hover
  const d5 = '#7b7b7b' // disabled button

  // Main colors for light theme
  const ltext = '#000000' // text
  const l1 = '#FFFFFF' // background
  const l5 = '#F7F7F7' // paper
  const l2 = '#003B6D' // primary
  const l3 = '#0064BA' // secondary
  const l4 = '#595959' // disabled link

  const components = {
    dark: {
      MuiCssBaseline: {
        styleOverrides: {
          a: {
            color: d3,
          },
          span: {
            fontSize: 18,
          },
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          root: {
            // disabled input label color
            '&.Mui-disabled': {
              color: '#9fa4ad',
            },
            // filter text color
            '&.Mui-focused': {
              color: dtext,
            },
          },
        },
      },
      MuiToolTip: { styleOverrides: { root: { backgroundColor: '#58595A' } } },
    },
    light: {
      MuiCssBaseline: {
        styleOverrides: {
          a: {
            color: l3,
          },
          span: {
            fontSize: 18,
          },
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          root: {
            // disabled input label color
            '&.Mui-disabled': {
              color: '#6b6b6b',
            },
          },
        },
      },
      MuiToolTip: { styleOverrides: { root: { backgroundColor: '#666666' } } },
    },
  }

  return experimental_extendTheme({
    typography: {
      fontFamily: '"Roboto Condensed", sans-serif',
      fontSize: 16,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 700,
      h1: { fontSize: '2rem', fontWeight: 400 },
      h2: { fontSize: '3rem' },
      h3: { fontSize: '1.43rem', fontWeight: 700, lineHeight: 1.6 },
      h4: { fontSize: '1.25rem' },
      body2: { fontSize: '0.875rem' },
    },
    components: themeName === 'dark' ? components.dark : components.light,
    colorSchemes: {
      dark: {
        palette: {
          contrastThreshold: 4.5,
          background: {
            default: d1,
            paper: d6,
          },
          primary: {
            main: d2,
          },
          secondary: {
            main: d3,
          },
          text: {
            primary: dtext,
            secondary: d3,
          },
          action: {
            active: dtext,
            hover: d4,
            disabled: d5,
            focus: dtext,
          },
        },
      },
      light: {
        palette: {
          contrastThreshold: 4.5,
          background: {
            default: l1,
            paper: l5,
          },
          primary: {
            main: l2,
          },
          secondary: {
            main: l3,
          },
          text: {
            primary: ltext,
            secondary: l3,
          },
          action: {
            active: l2,
            disabled: l4,
            focus: l2,
          },
        },
      },
    },
  })
}
export { getTheme }
