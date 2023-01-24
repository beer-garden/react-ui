import { AutocompleteInputChangeReason } from '@mui/material'
import { SyntheticEvent, useCallback, useEffect, useState } from 'react'

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

const useDebounceOnEventFunction = <
  T extends (
    event: SyntheticEvent<Element, Event>,
    value: string,
    reason: AutocompleteInputChangeReason,
  ) => void,
>(
  func: T,
  delay: number,
): ((
  event: SyntheticEvent<Element, Event>,
  value: string,
  reason: AutocompleteInputChangeReason,
) => void) => {
  const debounce = (func: T) => {
    let timer: NodeJS.Timeout | null
    return (
      event: SyntheticEvent<Element, Event>,
      value: string,
      reason: AutocompleteInputChangeReason,
    ) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        timer = null
        func(event, value, reason)
      }, delay)
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(debounce(func), [])
}

export { useDebounce, useDebounceOnEventFunction }
