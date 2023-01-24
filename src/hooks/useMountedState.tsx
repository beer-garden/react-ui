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
 *
 * Overload to handle not needing to put undefined as init argument
 * @param init
 * @returns
 */
export function useMountedState<T>(init: T | (() => T)): [T, (arg0: T) => void]
export function useMountedState<T>(
  init?: T | (() => T | undefined),
): [T | undefined, (arg0?: T) => void]
export function useMountedState<T>(
  init?: T | (() => T | undefined),
): [T | undefined, (arg0?: T) => void] {
  const isMounted = useIsMounted()
  const [state, setState] = useState<T | undefined>(init)
  const setStateCallback = useCallback(
    (args?: T) => {
      if (isMounted()) {
        return setState(args)
      }
    },
    [isMounted],
  )
  return [state, setStateCallback]
}
