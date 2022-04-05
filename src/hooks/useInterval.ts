import { useRef, useEffect } from 'react'

const useInterval = (callback: () => void, delay: number | undefined) => {
  const callbackRef = useRef(callback)
  const intervalRef = useRef<number | undefined>(delay)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    const action = () => callbackRef.current()

    if (delay) {
      const delayInMs = delay * 1000 * 60 // milliseconds
      intervalRef.current = window.setInterval(action, delayInMs)
    }

    return () => {
      if (intervalRef.current) {
        window.clearTimeout(intervalRef.current)
      }
    }
  }, [delay])

  return intervalRef
}

export { useInterval }
