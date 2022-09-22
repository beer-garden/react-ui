import {
  createContext,
  KeyboardEvent,
  MouseEvent,
  PropsWithChildren,
} from 'react'

export type Opener = (open: boolean) => (event: KeyboardEvent | MouseEvent) => void

type NavigationBarContextProviderProps = {
  toggleDrawer: Opener
  drawerIsOpen: boolean
} & PropsWithChildren<Record<never, never>>

type navigationBarContext = {
  toggleDrawer: Opener
  drawerIsOpen: boolean
}

const NavigationBarContext = createContext<navigationBarContext>({
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
