import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import MenuIcon from '@mui/icons-material/Menu'
import { Divider, Drawer, IconButton, Toolbar, Typography } from '@mui/material'
import * as React from 'react'
import AppBar from './AppBar'
import DrawerHeader from './DrawerHeader'
import MenuList from './MenuList/MenuList'
import { NavigationBarContextProvider } from './NavigationBarContext'

export const drawerWidth = 200

const NavigationBar = () => {
  const [drawerIsOpen, setDrawerIsOpen] = React.useState(false)

  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return
    }
    setDrawerIsOpen(open)
  }

  return (
    <NavigationBarContextProvider toggleDrawer={toggleDrawer}>
      <AppBar position="static" open={drawerIsOpen}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ mr: 2, ...(drawerIsOpen && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Beer Garden</Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        open={drawerIsOpen}
        onClose={toggleDrawer(false)}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <DrawerHeader onClick={toggleDrawer(false)}>
          <IconButton>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <MenuList /> {/* TODO: prop drilling */}
      </Drawer>
    </NavigationBarContextProvider>
  )
}

export default NavigationBar
