import { useEffect, useRef, useState } from 'react'

export const useTokenExpiration = (
  onTokenRefreshRequired: () => Promise<void>
) => {
  const clearAutomaticRefresh = useRef<number>()
  const [tokenExpiration, setTokenExpiration] = useState<Date | undefined>(
    undefined
  )

  useEffect(() => {
    if (tokenExpiration instanceof Date && !isNaN(tokenExpiration.valueOf())) {
      const now = new Date()
      const triggerMillseconds = tokenExpiration.getTime() - now.getTime()

      clearAutomaticRefresh.current = window.setTimeout(async () => {
        onTokenRefreshRequired()
      }, triggerMillseconds)
    }

    return () => {
      window.clearTimeout(clearAutomaticRefresh.current)
    }
  }, [onTokenRefreshRequired, tokenExpiration])

  const clearAutomaticTokenRefresh = () => {
    window.clearTimeout(clearAutomaticRefresh.current)
    setTokenExpiration(undefined)
  }

  return {
    clearAutomaticTokenRefresh,
    setTokenExpiration,
  }
}
