import { createTheme } from '@mui/material/styles'

const baseTheme = createTheme({
  typography: {
    fontFamily: '\'Roboto Condensed\', sans-serif",
    fontSize: 16,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 700,
    h4: {
      fontSize: 32, //2x font size
    },
  },
})

//Main colors for dark theme
const dtext = '#FFFFFF'
const d1 = '#313B4D'
const d2 = '#3B404A'
const d3 = '#63abff'

//one offs
const d4 = '#2a2d34' //hover
const d5 = '#7b7b7b' //disabled button

const darkTheme = createTheme({
  ...baseTheme,
  typography: {
    body1: {
      color: dtext,
    },
    button: {
      color: dtext,
    },
  },
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
  components: {
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
})

//Main colors for light theme
const l1 = '#ffffff'
const l2 = '#003B6D'
const l3 = '#0064ba'

//one off for disabled link color
const l4 = '#595959'

const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
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
  components: {
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
})

export { darkTheme, lightTheme }
