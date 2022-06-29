import { MakeItHappenButton } from 'pages/CommandIndex'
import { filterSystems } from 'services/system.service'
import { Command, System } from 'types/custom_types'

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
