import axios from 'axios'
import { useEffect, useState } from 'react'

const useIsAuthEnabled = () => {
  const [authIsEnabled, setAuthIsEnabled] = useState(true)

  useEffect(() => {
    let mounted = true

    axios
      .get('/config', {
        timeout: 10000,
        headers: {
          Accept: 'application/json',
        },
      })
      .then(
        (res) => {
          if (mounted) {
            try {
              setAuthIsEnabled(res.data?.auth_enabled ?? false)
            } catch {
              setAuthIsEnabled(false)
            }
          }
        },
        (err) => {
          console.log('ERROR in useIsAuthEnabled: ', err)
          if (mounted) {
            setAuthIsEnabled(false)
          }
        }
      )
    console.log('AUTH ENABLED SET TO: ', authIsEnabled)

    return () => {
      mounted = false
    }
  }, [])

  return { authIsEnabled }
}

export { useIsAuthEnabled }
