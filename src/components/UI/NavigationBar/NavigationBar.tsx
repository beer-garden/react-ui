import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import MenuIcon from '@mui/icons-material/Menu'
import { Divider, Drawer, IconButton, Toolbar, Typography } from '@mui/material'
import { KeyboardEvent, MouseEvent, useState } from 'react'
import AppBar from './AppBar'
import DrawerHeader from './DrawerHeader'
import MenuList from './MenuList/MenuList'

export const drawerWidth = 200

const NavigationBar = () => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false)

  const toggleDrawer = (open: boolean) => (
    event: KeyboardEvent | MouseEvent
  ) => {
    if (
      event.type === 'keydown' &&
      ((event as KeyboardEvent).key === 'Tab' ||
        (event as KeyboardEvent).key === 'Shift')
    ) {
      return
    }
    setDrawerIsOpen(open)
  }

  return (
    <div>
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
        <MenuList toggleDrawer={toggleDrawer} /> {/* TODO: prop drilling */}
      </Drawer>
    </div>
  )
}

export default NavigationBar
