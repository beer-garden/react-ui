import { AutocompleteInputChangeReason } from '@mui/material'
import { useMountedState } from 'hooks/useMountedState'
import { SyntheticEvent, useCallback, useEffect } from 'react'

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

const useDebounceOnEventFunction = <
  T extends (
    event: SyntheticEvent<Element, Event>,
    value: string,
    reason: AutocompleteInputChangeReason,
  ) => void,
>(
  func: T | undefined,
  delay: number,
): ((
  event: SyntheticEvent<Element, Event>,
  value: string,
  reason: AutocompleteInputChangeReason,
) => void) => {
  const debounce = (func: T | undefined) => {
    let timer: NodeJS.Timeout | null
    return (
      event: SyntheticEvent<Element, Event>,
      value: string,
      reason: AutocompleteInputChangeReason,
    ) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        timer = null
        if (func) {
          func(event, value, reason)
        }
      }, delay)
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(debounce(func), [])
}

const useDebounceEmptyFunction = <
  T extends () => void,
>(
  func: T | undefined,
  delay: number,
): (() => void) => {
  const debounce = (func: T | undefined) => {
    let timer: NodeJS.Timeout | null
    return () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        timer = null
        if (func) {
          func()
        }
      }, delay)
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(debounce(func), [])
}

export { useDebounce, useDebounceEmptyFunction, useDebounceOnEventFunction }
