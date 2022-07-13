import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { Box, IconButton, Tooltip } from '@mui/material'
import useAxios from 'axios-hooks'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { MakeItHappenButton } from 'pages/CommandIndex'
import {
  ChangeEvent as ReactChangeEvent,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useParams } from 'react-router-dom'
import { Command, CommandRow } from 'types/command_types'
import { System } from 'types/custom_types'

export const useCommands = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const [commands, setCommands] = useState<CommandRow[]>([])
  const [includeHidden, setIncludeHidden] = useState(false)
  const { namespace, system_name: systemName, version } = useParams()
  const [{ data, error }] = useAxios({
    url: '/api/v1/systems',
    method: 'get',
    withCredentials: authEnabled,
  })

  useEffect(() => {
    if (data && !error) {
      setCommands(
        commandsFromSystems(
          data,
          includeHidden,
          namespace,
          systemName,
          version,
        ),
      )
    }
  }, [data, error, namespace, version, systemName, includeHidden])

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
    version,
    includeHidden,
    hiddenOnChange,
  }
}

export const generateCommandName = (hidden: boolean, name: string) => {
  return hidden ? (
    <Tooltip title="hidden command" aria-label={name + ' (hidden)'}>
      <Box component="span">
        {name}
        <IconButton disabled>
          <VisibilityOffIcon color="disabled" fontSize="small" />
        </IconButton>
      </Box>
    </Tooltip>
  ) : (
    name
  )
}

const commandMapper = (command: Command): CommandRow => {
  return {
    namespace: command.namespace,
    system: command.systemName,
    version: command.systemVersion,
    command: command.name,
    name: generateCommandName(command.hidden, command.name),
    description: command.description ?? 'No description',
    action: MakeItHappenButton(command),
  }
}

/**
 * Consolidate an array of filters into a single filter
 *
 * @param filters - An array of filters that each take an item and return true
 * or false
 * @returns A function that takes an argument and returns true only if every
 * filter in filters returns true for that argument
 */
const filtersToFilter = <T,>(
  filters: ((arg: T) => boolean)[],
): ((arg: T) => boolean) => {
  return (arg) => {
    return filters.every((fn) => fn(arg))
  }
}

/**
 *
 * @param system - A System object
 * @returns - The commands associated with the system, each augmented with the
 * namespace, system name and system version of its parent
 */
const commandsAugmenter = (system: System): Command[] => {
  return system.commands.map(
    (cmd: Command): Command => ({
      ...cmd,
      namespace: system.namespace,
      systemName: system.name,
      systemVersion: system.version,
    }),
  )
}

const commandsFromSystems = (
  systems: System[],
  includeHidden = false,
  namespace?: string,
  systemName?: string,
  version?: string,
) => {
  const hasCommands = (x: System) => !!x.commands && x.commands.length > 0
  const systemMatcher = [(x: System) => true]
  const filterHidden = (x: Command) => !x.hidden || includeHidden

  if (version) {
    systemMatcher.push((x: System) => x.version === version)
  }
  if (systemName) {
    systemMatcher.push((x: System) => x.name === systemName)
  }
  if (namespace) {
    systemMatcher.push((x: System) => x.namespace === namespace)
  }

  let commands = systems
    .filter(filtersToFilter(systemMatcher))
    .filter(hasCommands)
    .map(commandsAugmenter)
    .flat()
    .filter(filterHidden)

  if (includeHidden) {
    /* make the hidden appear at the top of the list */
    commands = commands
      .slice()
      .sort((a: Command, b: Command) =>
        a.hidden && !b.hidden ? -1 : !a.hidden && b.hidden ? 1 : 0,
      )
  }

  return commands.map(commandMapper)
}
