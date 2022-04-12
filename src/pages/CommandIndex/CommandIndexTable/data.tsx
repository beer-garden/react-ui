import useAxios from 'axios-hooks'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  ChangeEvent as ReactChangeEvent,
} from 'react'
import { Column } from 'react-table'
import { useIsAuthEnabled } from '../../../hooks/useIsAuthEnabled'
import { System, Command } from '../../../types/custom_types'
import { useParams } from 'react-router-dom'
import MakeItHappenButton from '../MakeItHappenButton'
import { Box, IconButton, Tooltip } from '@mui/material'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

export type CommandIndexTableData = {
  namespace: string
  system: string
  version: string
  name: string | JSX.Element
  description: string
  executeButton: JSX.Element
}

const commandMapper = (command: Command): CommandIndexTableData => {
  return {
    namespace: command.namespace,
    system: command.systemName,
    version: command.systemVersion,
    name: command.hidden ? (
      <Tooltip title="hidden command" aria-label={command.name + ' (hidden)'}>
        <Box component="span">
          {command.name}
          <IconButton disabled>
            <VisibilityOffIcon color="disabled" fontSize="small" />
          </IconButton>
        </Box>
      </Tooltip>
    ) : (
      command.name
    ),
    description: command.description ?? 'No description',
    executeButton: MakeItHappenButton(command),
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

const useCommands = () => {
  const [commands, setCommands] = useState<CommandIndexTableData[]>([])
  const [includeHidden, setIncludeHidden] = useState(false)
  const { namespace, system_name: systemName, version } = useParams()
  const { authIsEnabled } = useIsAuthEnabled()
  const [{ data, error }] = useAxios({
    url: '/api/v1/systems',
    method: 'get',
    withCredentials: authIsEnabled,
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

const useCommandIndexTableColums = () => {
  return useMemo<Column<CommandIndexTableData>[]>(
    () => [
      {
        Header: 'Namespace',
        accessor: 'namespace',
        width: 150,
      },
      {
        Header: 'System',
        accessor: 'system',
        filter: 'fuzzyText',
        width: 150,
      },
      {
        Header: 'Version',
        accessor: 'version',
        width: 120,
      },
      {
        Header: 'Command',
        accessor: 'name',
        width: 300,
      },
      {
        Header: 'Description',
        accessor: 'description',
        width: 300,
      },
      {
        Header: '',
        accessor: 'executeButton',
        disableSortBy: true,
        disableGroupBy: true,
        disableFilters: true,
        canHide: false,
        width: 120,
      },
    ],
    [],
  )
}

export { useCommands, useCommandIndexTableColums }
