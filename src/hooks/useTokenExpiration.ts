import { useCallback, useEffect, useRef, useState } from 'react'

export const useTokenExpiration = (
  onTokenRefreshRequired: () => Promise<void>,
) => {
  const tokenRefreshTimerId = useRef<number>()
  const [tokenExpiration, setTokenExpiration] = useState<Date | undefined>(
    undefined,
  )

  useEffect(() => {
    if (tokenExpiration instanceof Date && !isNaN(tokenExpiration.valueOf())) {
      const now = new Date()
      const triggerMilliseconds = tokenExpiration.getTime() - now.getTime()

      tokenRefreshTimerId.current = window.setTimeout(async () => {
        onTokenRefreshRequired()
      }, triggerMilliseconds)
    }

    return () => {
      window.clearTimeout(tokenRefreshTimerId.current)
    }
  }, [onTokenRefreshRequired, tokenExpiration])

  const clearAutomaticTokenRefresh = useCallback(() => {
    window.clearTimeout(tokenRefreshTimerId.current)
    setTokenExpiration(undefined)
  }, [setTokenExpiration])

  return {
    clearAutomaticTokenRefresh,
    setTokenExpiration,
  }
}
