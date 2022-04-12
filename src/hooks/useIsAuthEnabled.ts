import axios from 'axios'
import { useEffect, useState } from 'react'

const useIsAuthEnabled = () => {
  const [authIsEnabled, setAuthIsEnabled] = useState(false)

  useEffect(() => {
    let mounted = true

    axios
      .get('/config', {
        timeout: 1000,
        headers: {
          Accept: 'application/json',
        },
      })
      .then(
        (res) => {
          if (mounted) {
            try {
              setAuthIsEnabled(res.data?.auth_enabled ?? false)
              console.log('AUTH ENABLED SET TO: ', authIsEnabled)
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

    return () => {
      mounted = false
    }
  }, [authIsEnabled])

  return { authIsEnabled }
}

export { useIsAuthEnabled }
