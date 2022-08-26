import { useEffect, useRef } from 'react'

export const useInterval = (callback, delay) => {
  const savedCB = useRef()

  useEffect(() => {
    savedCB.current = callback
  }, [callback])

  useEffect(() => {
    let tick
    if (savedCB.current) {
      tick = () => savedCB.current()
    }
    if (delay != null) {
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [callback, delay])
}
