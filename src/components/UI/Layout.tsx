import { FC, useContext, useEffect } from 'react'
import NavigationBar from './NavigationBar/NavigationBar'
import { ThemeContext } from './Theme/ThemeProvider'

const Layout: FC = ({ children }) => {
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
