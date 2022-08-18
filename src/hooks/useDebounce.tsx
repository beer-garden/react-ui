import { useCallback, useEffect, useRef, useState } from 'react'

const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// this 'any' is unfortunately necessary to be maximally flexible
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useDebounceCallback = <T extends (...args: any) => ReturnType<T>>(
  func: T,
  delay: number,
) => {
  const timeout = useRef<ReturnType<typeof setTimeout>>()

  return useCallback(
    (...args) => {
      const later = () => {
        clearTimeout(timeout.current)
        func(...args)
      }

      clearTimeout(timeout.current)
      timeout.current = setTimeout(later, delay)
    },
    [func, delay],
  )
}

export { useDebounce, useDebounceCallback }
