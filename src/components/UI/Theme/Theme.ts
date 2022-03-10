import { createTheme } from '@mui/material/styles'

const baseTheme = createTheme({
  typography: {
    fontFamily: "'Roboto Condensed', sans-serif",
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 700,
  },
})

const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    // primary: {
    //   main: '#26a27b',
    // },
    // secondary: {
    //   main: '#fafafa',
    // },
  },
})
const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    // primary: {
    //   main: '#fafafa',
    // },
    // secondary: {
    //   main: '#26a27b',
    // },
  },
})

export { darkTheme, lightTheme }
