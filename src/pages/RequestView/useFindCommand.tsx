import { AxiosError, AxiosResponse } from 'axios'
import { useSystems } from 'hooks/useSystems'
import { useState } from 'react'
import { Command, System } from 'types/backend-types'
import { SystemCommandPair } from 'types/custom-types'

const useFindCommand = () => {
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [foundPair, setFoundPair] = useState<SystemCommandPair | undefined>(
    undefined,
  )
  const { getSystems } = useSystems()

  const handleGetSystemsError = <T,>(error: AxiosError<T>) => {
    setIsError(true)

    console.error(error.toJSON())
  }

  const findCommand = (commandName: string) => {
    const handleGetSystemsResponse = (response: AxiosResponse<System[]>) => {
      setIsLoading(false)

      const systems = response.data

      const matcher = (s: System): SystemCommandPair | null => {
        const { commands, ...stripped } = s

        const filtered = commands.filter((c) => c.name === commandName)

        if (filtered.length > 0) {
          return {
            system: stripped,
            command: {
              ...(filtered.pop() as Command),
              namespace: s.namespace,
              systemName: s.name,
              systemVersion: s.version,
              systemId: s.id,
            },
          }
        }

        return null
      }

      const matched = systems
        .map(matcher)
        .filter((x) => x !== null) as SystemCommandPair[]

      if (matched.length > 0) {
        setFoundPair(matched.pop())
        setIsError(false)
      } else {
        setFoundPair(undefined)
        setIsError(true)
      }
    }

    setIsLoading(true)

    getSystems().then(handleGetSystemsResponse).catch(handleGetSystemsError)

    if (!isLoading && !isError) {
      return foundPair
    } else {
      throw new Error()
    }
  }

  return { findCommand }
}

export { useFindCommand }
