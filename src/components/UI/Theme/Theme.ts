import { ThemeContext } from '@emotion/react'
import { createTheme } from '@mui/material/styles'
import { Link as RouterLink} from 'react-router-dom'

const baseTheme = createTheme({
  typography: {
    fontFamily: "'Roboto Condensed', sans-serif",
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 700,
  },
})
//Colors for dark theme
// Current: #61892F #86C232 #222629 #474B4F #6B6E70
const dtext = '#FFFFFF';
const dcolor1 = '#61892F';
const dcolor2 = '#86C232';
const dcolor3 = '#222629';
const dcolor4 = '#474B4F';
const dcolor5 = '#6B6E70';

const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    background: {
      default: dcolor4,
    },
    primary: {
       main: dcolor3,
     },
     secondary: {
       main: dcolor2,
     },
     text: {
      primary: dtext,
      secondary: dcolor1,
    },
  },
  components: {

    MuiBreadcrumbs: {
      styleOverrides: {
        li: {
          a: {
            color: dcolor2
          }
        }
      }
    },

    MuiButton: {
      styleOverrides: {
        sizeSmall: {
          color: dcolor2
        }
      }
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: dcolor5
        }
      }
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: dcolor5,
          color: dtext
        }
      }
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          color: dcolor2
        },
      }
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: dcolor4
          }
        }
      }
    },

    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: dtext
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
          span: {
            div: {
              div: {
                a: {
                  color: dcolor2
                }
              },
              a: {
                color: dcolor2
              }
            }
          }
        }
      }
    },
  }
})

// #3d5a80  #98c1d9  #e0fbfc  #ee6c4d #293241
const lcolor1 = '#3d5a80';
const lcolor2 = '#98c1d9';  
const lcolor3 = '#e0fbfc';  
const lcolor4 = '#ee6c4d'; 
const lcolor5 = '#293241';

const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    background: {
      default: '#ffffff',
    },
    primary: {
       main: lcolor1,
     },
     secondary: {
       main: lcolor2,
     },
     text: {
      primary: lcolor5,
      secondary: lcolor4,
    },
  },
  components: {
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: lcolor2
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: lcolor3,
          color: lcolor1
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          color: lcolor1
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          span: {
            div: {
              div: {
                a: {
                  color: lcolor4
                }
              },
              a: {
                color: lcolor4
              }
            }
          }
        }
      }
    },
  }
})

export { darkTheme, lightTheme }
