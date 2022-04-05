import { System } from '../../types/custom_types'
import ExploreButton from './ExploreButton'

const formatSystems = (systems: System[]) => {
  const formattedSystems: (string | JSX.Element | number)[][] = []

  for (const index in systems) {
    formattedSystems.push([
      systems[index].namespace,
      systems[index].name,
      systems[index].version,
      systems[index].description,
      systems[index].commands.length,
      systems[index].instances.length,
      ExploreButton(systems[index]),
    ])
  }

  return formattedSystems
}

export { formatSystems }
