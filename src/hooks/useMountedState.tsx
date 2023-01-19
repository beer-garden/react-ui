import { useCallback, useEffect, useRef, useState } from 'react'

const useIsMounted = () => {
  const mounted = useRef(false)
  const isMounted = useCallback(() => mounted.current, [])
  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])
  return isMounted
}

/**
 * Use in place of `useState`. Checks if component is mounted before every state
 * update call. Good for state updates inside async calls!
 * @param init
 * @returns
 */
export function useMountedState<T>(
  init?: T,
): [T | undefined, (arg0: T) => void] {
  const isMounted = useIsMounted()
  const [state, setState] = useState<T | undefined>(init)
  const setStateCallback = useCallback(
    (args: T) => {
      if (isMounted()) {
        return setState(args)
      }
    },
    [isMounted, setState],
  )
  return [state, setStateCallback]
}
