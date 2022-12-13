import { useSystems } from 'hooks/useSystems'
import {
  ChangeEvent as ReactChangeEvent,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useParams } from 'react-router-dom'
import { System } from 'types/backend-types'

export type CommandFormatter<T> = (
  systems: System[],
  includeHidden?: boolean,
  namespace?: string,
  systemName?: string,
  version?: string,
) => T[]

const useCommandsParameterized = <T,>(formatter: CommandFormatter<T>) => {
  const [commands, setCommands] = useState<T[]>([])
  const [systemId, setSystemId] = useState('')
  const [includeHidden, setIncludeHidden] = useState(false)
  const { namespace, systemName, version } = useParams() as ReturnType<
    typeof useParams
  > & { namespace: string; systemName: string; version: string }
  const { getSystems } = useSystems()

  useEffect(() => {
    getSystems().then((response) => {
      setCommands(
        formatter(response.data, includeHidden, namespace, systemName, version),
      )
      const foundSystem = response.data.find(
        (system: System) => system.name === systemName,
      )
      if (foundSystem) setSystemId(foundSystem.id)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [namespace, version, systemName, includeHidden])

  const hiddenOnChange = useCallback(
    (event: ReactChangeEvent<HTMLInputElement>) => {
      setIncludeHidden(event.target.checked)
    },
    [],
  )

  return {
    commands,
    namespace,
    systemName,
    systemId,
    version,
    includeHidden,
    hiddenOnChange,
  }
}

export { useCommandsParameterized }
