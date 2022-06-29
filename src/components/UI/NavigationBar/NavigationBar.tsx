import MenuIcon from '@mui/icons-material/Menu'
import { Divider, Drawer, IconButton, Toolbar, Typography } from '@mui/material'
import { AppBar } from 'components/UI/NavigationBar/AppBar'
import { DrawerFooter } from 'components/UI/NavigationBar/DrawerFooter'
import { DrawerHeader } from 'components/UI/NavigationBar/DrawerHeader'
import { MenuList } from 'components/UI/NavigationBar/MenuList/MenuList'
import { NavigationBarContextProvider } from 'components/UI/NavigationBar/NavigationBarContext'
import { useLocalStorage } from 'hooks/useLocalStorage'
import * as React from 'react'

export const closedDrawerWidth = 37
export const openedDrawerWidth = 205

interface NavigationBarProps {
  setMarginLeft: React.Dispatch<React.SetStateAction<number>>
}

const NavigationBar = ({ setMarginLeft }: NavigationBarProps) => {
  const [drawerIsPinned, _setDrawerIsPinned] = useLocalStorage(
    'drawerIsPinned',
    false,
  )
  const [drawerIsOpen, setDrawerIsOpen] = React.useState(drawerIsPinned)

  const toggleDrawer = (open: boolean) => () => {
    setDrawerIsOpen(open || drawerIsPinned)
  }

  const toggleDrawerPin = (value: boolean) => () => {
    _setDrawerIsPinned(value)
    setMarginLeft(value ? openedDrawerWidth : closedDrawerWidth)
    setDrawerIsOpen(value)
  }
  return (
    <NavigationBarContextProvider
      toggleDrawer={toggleDrawer}
      drawerIsOpen={drawerIsOpen}
    >
      <AppBar
        position="sticky"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawerPin(!drawerIsPinned)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Beer Garden</Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        ModalProps={{
          keepMounted: true,
        }}
        onMouseOver={toggleDrawer(true)}
        onMouseLeave={toggleDrawer(false)}
        open={drawerIsOpen}
        sx={{
          width: drawerIsOpen ? openedDrawerWidth : closedDrawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerIsOpen ? openedDrawerWidth : closedDrawerWidth,
            boxSizing: 'border-box',
            overflowX: 'hidden',
          },
        }}
      >
        <DrawerHeader />
        <Divider />
        <MenuList /> {/* TODO: prop drilling */}
        <DrawerFooter />
      </Drawer>
    </NavigationBarContextProvider>
  )
}

export { NavigationBar }
