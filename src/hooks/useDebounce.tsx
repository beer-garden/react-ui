import { useMountedState } from 'hooks/useMountedState'
import { useEffect } from 'react'

const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useMountedState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay, setDebouncedValue])

  return debouncedValue
}

export { useDebounce }
