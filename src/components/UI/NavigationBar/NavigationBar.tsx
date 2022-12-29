import MenuIcon from '@mui/icons-material/Menu'
import {
  Divider,
  Drawer,
  IconButton,
  Theme,
  Toolbar,
  Typography,
} from '@mui/material'
import { AppBar } from 'components/UI/NavigationBar/AppBar'
import { DrawerFooter } from 'components/UI/NavigationBar/DrawerFooter'
import { DrawerHeader } from 'components/UI/NavigationBar/DrawerHeader'
import { MenuList } from 'components/UI/NavigationBar/MenuList/MenuList'
import { NavigationBarContextProvider } from 'components/UI/NavigationBar/NavigationBarContext'
import { AuthContainer } from 'containers/AuthContainer'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { useLocalStorage } from 'hooks/useLocalStorage'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

export const closedDrawerWidth = 37
export const openedDrawerWidth = 205

interface NavigationBarProps {
  setMarginLeft: Dispatch<SetStateAction<number>>
}

const NavigationBar = ({ setMarginLeft }: NavigationBarProps) => {
  const [drawerIsPinned, _setDrawerIsPinned] = useLocalStorage(
    'drawerIsPinned',
    false,
  )
  const [drawerIsOpen, setDrawerIsOpen] = useState(drawerIsPinned)
  const { authEnabled } = ServerConfigContainer.useContainer()
  const { user } = AuthContainer.useContainer()

  const toggleDrawer = (open: boolean) => () => {
    setDrawerIsOpen(open || drawerIsPinned)
  }

  const toggleDrawerPin = (value: boolean) => () => {
    _setDrawerIsPinned(value)
    setMarginLeft(value ? openedDrawerWidth : closedDrawerWidth)
    setDrawerIsOpen(value)
  }

  useEffect(() => {
    // Workaround to make the URL play nice
    if (!window.location.hash.startsWith('#/')) {
      window.location.hash = window.location.hash.replace(/^#[^/]+\//, '#/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.hash])

  return (
    <NavigationBarContextProvider
      toggleDrawer={toggleDrawer}
      drawerIsOpen={drawerIsOpen}
    >
      <AppBar
        position="sticky"
        sx={{ zIndex: (theme: Theme) => theme.zIndex.drawer + 1 }}
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
          <Typography variant="h1" sx={{ flexGrow: 1 }}>
            Beer Garden
          </Typography>
          {authEnabled && user && (
            <Typography variant="subtitle1">Hello, {user}!</Typography>
          )}
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
