import { MakeItHappenButton } from 'pages/CommandIndex'
import { Command, System } from 'types/backend-types'

const filterSystems = (
  systems: System[],
  params: {
    name?: string | undefined
    namespace?: string | undefined
    version?: string | undefined
  },
) => {
  if (params.name) {
    systems = systems.filter(function (system: System) {
      return system['name'] === params.name
    })
  }
  if (params.namespace) {
    systems = systems.filter(function (system: System) {
      return system['namespace'] === params.namespace
    })
  }
  if (params.version) {
    systems = systems.filter(function (system: System) {
      return system['version'] === params.version
    })
  }
  return systems
}

const formatCommands = (commands: Command[]) => {
  const formattedData: (string | JSX.Element)[][] = []

  for (const index in commands) {
    formattedData[index] = [
      commands[index].namespace,
      commands[index].systemName,
      commands[index].systemVersion,
      commands[index].name,
      commands[index].description || 'No description provided',
      MakeItHappenButton(commands[index]),
    ]
  }
  return formattedData
}

const getCommands = (
  systems: System[],
  namespace: string | undefined,
  systemName: string | undefined,
  version: string | undefined,
) => {
  const filteredSystems = filterSystems(systems, {
    namespace: namespace,
    name: systemName,
    version: version,
  })
  const commands: Command[][] = []

  for (const sysIndex in filteredSystems) {
    const thisSystem = filteredSystems[sysIndex]

    if (thisSystem.commands) {
      const theseCommands = thisSystem.commands

      for (const cmdIndex in theseCommands) {
        filteredSystems[sysIndex].commands[cmdIndex]['namespace'] =
          filteredSystems[sysIndex].namespace
        filteredSystems[sysIndex].commands[cmdIndex]['systemName'] =
          filteredSystems[sysIndex].name
        filteredSystems[sysIndex].commands[cmdIndex]['systemVersion'] =
          filteredSystems[sysIndex].version
      }

      commands.push(filteredSystems[sysIndex].commands)
    }
  }

  return commands.flat()
}

export { formatCommands as formatData, getCommands }
