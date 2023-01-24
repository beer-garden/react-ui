import { NavigationBar } from 'components/UI/NavigationBar'
import {
  closedDrawerWidth,
  openedDrawerWidth,
} from 'components/UI/NavigationBar'
import { useMountedState } from 'hooks/useMountedState'
import { PropsWithChildren } from 'react'

const Layout = ({ children }: PropsWithChildren<Record<never, never>>) => {
  let drawerIsPinned = localStorage.getItem('drawerIsPinned')
  if (drawerIsPinned) {
    drawerIsPinned = JSON.parse(drawerIsPinned)
  }

  const [marginLeft, setMarginLeft] = useMountedState<number>(
    drawerIsPinned ? openedDrawerWidth : closedDrawerWidth,
  )

  return (
    <>
      <NavigationBar setMarginLeft={setMarginLeft} />
      <div
        style={{
          margin: '0 auto',
          maxWidth: '95%',
          marginLeft: `${marginLeft}px`,
          padding: '1rem 1.0875rem 1.45rem',
        }}
      >
        <main>{children}</main>
      </div>
    </>
  )
}

export default Layout
