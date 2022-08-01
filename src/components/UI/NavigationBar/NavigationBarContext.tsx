import * as React from 'react'

type Opener = (
  open: boolean,
) => (event: React.KeyboardEvent | React.MouseEvent) => void

type NavigationBarContextProviderProps = {
  toggleDrawer: Opener
  drawerIsOpen: boolean
} & React.PropsWithChildren<Record<never, never>>

type navigationBarContext = {
  toggleDrawer: Opener
  drawerIsOpen: boolean
}

const NavigationBarContext = React.createContext<navigationBarContext>({
  toggleDrawer: {} as Opener,
  drawerIsOpen: false,
})

const NavigationBarContextProvider = ({
  toggleDrawer,
  drawerIsOpen,
  children,
}: NavigationBarContextProviderProps) => {
  return (
    <NavigationBarContext.Provider
      value={{ toggleDrawer: toggleDrawer, drawerIsOpen: drawerIsOpen }}
    >
      {children}
    </NavigationBarContext.Provider>
  )
}

export { NavigationBarContext, NavigationBarContextProvider }
