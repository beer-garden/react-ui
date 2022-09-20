import { DebugContainer } from 'containers/DebugContainer'
import { useCallback, useState } from 'react'

const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const { DEBUG_LOCAL_STORAGE } = DebugContainer.useContainer()
  const [storedValue, _setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      if (DEBUG_LOCAL_STORAGE) {
        console.log('useLocalStorage: not operating in a browser')
      }

      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      let maybeParsed

      if (item) {
        maybeParsed = JSON.parse(item)
      } else {
        if (DEBUG_LOCAL_STORAGE) {
          console.log(
            'useLocalStorage - cannot parse from local storage:',
            item,
          )
        }

        maybeParsed = initialValue
      }

      return maybeParsed
    } catch (error) {
      console.log(error)
      return initialValue
    }
  })

  const setStoredValue = useCallback(
    (value: T) => {
      if (DEBUG_LOCAL_STORAGE) {
        console.log('useLocalStorage - setting stored value:', value)
      }
      _setStoredValue(value)
    },
    [DEBUG_LOCAL_STORAGE],
  )

  const setValue = useCallback(
    (value: T): void => {
      try {
        setStoredValue(value)

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(value))
        }
      } catch (error) {
        console.log(error)
      }
    },
    [key, setStoredValue],
  )

  return [storedValue, setValue] as const
}

export { useLocalStorage }
