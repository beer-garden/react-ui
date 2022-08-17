// import { deepOrange } from '@mui/material/colors'
import {
  experimental_extendTheme,
  SupportedColorScheme,
} from '@mui/material/styles'

//Main colors for dark theme
function getTheme(themeName: SupportedColorScheme) {
  const dtext = '#FFFFFF'
  const d1 = '#313B4D'
  const d2 = '#3B404A'
  const d3 = '#63abff'

  //one offs
  const d4 = '#2a2d34' //hover
  const d5 = '#7b7b7b' //disabled button

  //Main colors for light theme
  const l1 = '#ffffff'
  const l2 = '#003B6D'
  const l3 = '#0064ba'

  //one off for disabled link color
  const l4 = '#595959'

  const components = {
    dark: {
      MuiCssBaseline: {
        styleOverrides: {
          a: {
            color: d3,
          },
          span: {
            fontSize: 16,
          },
        },
      },

      //Current hacky fix for filter text color
      MuiFormLabel: {
        styleOverrides: {
          root: {
            '&.Mui-focused': {
              color: dtext,
            },
          },
        },
      },
    },
    light: {
      MuiCssBaseline: {
        styleOverrides: {
          a: {
            color: l3,
          },
          span: {
            fontSize: 16,
          },
        },
      },
    },
  }

  return experimental_extendTheme({
    typography: {
      fontFamily: '"Roboto Condensed", sans-serif',
      fontSize: 14,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 700,
    },
    components: themeName === 'dark' ? components.dark : components.light,
    colorSchemes: {
      dark: {
        palette: {
          background: {
            default: d1,
            paper: d2,
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
          background: {
            default: l1,
            paper: l1,
          },
          primary: {
            main: l2,
          },
          secondary: {
            main: l3,
          },
          text: {
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
