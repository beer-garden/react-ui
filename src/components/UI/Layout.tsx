import { PropsWithChildren, useContext, useEffect } from 'react'
import { NavigationBar } from 'components/UI/NavigationBar'
import { ThemeContext } from 'components/UI/Theme/ThemeProvider'

const Layout = ({ children }: PropsWithChildren<Record<never, never>>) => {
  const { setTheme } = useContext(ThemeContext)
  useEffect(() => {
    const theme = localStorage.getItem('bg-theme')
    if (theme) {
      const themePreference = localStorage.getItem('bg-theme')
      if (themePreference === 'dark') {
        setTheme && setTheme(themePreference)
      } else {
        setTheme && setTheme('light')
      }
    } else {
      localStorage.setItem('bg-theme', 'dark')
      setTheme && setTheme('dark')
    }
  }, [setTheme])

  return (
    <>
      <NavigationBar />
      <div
        style={{
          margin: `0 auto`,
          maxWidth: 1200,
          padding: `1rem 1.0875rem 1.45rem`,
        }}
      >
        <main>{children}</main>
      </div>
    </>
  )
}

export default Layout
