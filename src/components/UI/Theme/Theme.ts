import { ThemeContext } from '@emotion/react'
import { createTheme } from '@mui/material/styles'
import { text } from 'stream/consumers'

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
    // 2F4550 586F7C B8DBD9 F4F4F9',
    background: {
      default: '#474B4F',
    },
    primary: {
       main: '#222629',
     },
     secondary: {
       main: '#86C232',
     },
     text: {
      primary: '#FFFFFF',
      secondary: '#86C232',
    },
    action: {
      active: '#FFFFFF',
      hover: "#FFFFFF",
      selected: "#FFFFFF",
      selectedOpacity: 0.1,
      focus: "#FFFFFF"
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        a : '#FFFFFF'
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#6B6E70'
        }
      }
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          color: 'black'
        }
      }
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          // backgroundColor: '#D3D3D3',
          borderColor: 'black',
        },
      }
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#86C232'
        },
      }
    },

    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: 'white'
        }
      }
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#6B6E70",
          color: "white"
        }
      }
    },

    MuiLink: {
      styleOverrides: {
        root: {
          color: 'white'
          
        }
      }
    }
  }
})
const lightTheme = createTheme({
  //theme suggestion:
  // #3d5a80  #98c1d9  #e0fbfc  #ee6c4d #293241
  //#ffffff // #00171f // #003459 // #007ea7 // #00a8e8
  //#03045e // #0077b6 // #00b4d8 // #90e0ef // #caf0f8
  ...baseTheme,
  palette: {
    background: {
      default: '#ffffff',
    },
    primary: {
       main: '#3d5a80',
     },
     secondary: {
       main: '#0077b6',
     },
     text: {
      primary: '#293241',
      secondary: '#ee6c4d',
    },
  },
  components: {
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#98c1d9'
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#e0fbfc"
        }
      }
    }
  }
})

export { darkTheme, lightTheme }
