import * as React from 'react'

type Opener = (
  open: boolean
) => (event: React.KeyboardEvent | React.MouseEvent) => void

type NavigationBarContextProviderProps = {
  toggleDrawer: Opener
} & React.PropsWithChildren<Record<never, never>>

const NavigationBarContext = React.createContext<Opener>({} as Opener)

const NavigationBarContextProvider = ({
  toggleDrawer,
  children,
}: NavigationBarContextProviderProps) => {
  return (
    <NavigationBarContext.Provider value={toggleDrawer}>
      {children}
    </NavigationBarContext.Provider>
  )
}

export { NavigationBarContext, NavigationBarContextProvider }
