import { System } from '../../types/custom_types'
import {
  filterSystems,
  sortSystemsVersion,
} from '../../services/system.service'

const formatSystems = (
  namespaces: string[],
  allSystems: System[]
): { [key: string]: System[][] } => {
  const sortedSystems: { [key: string]: System[][] } = {}

  for (const namespace in namespaces) {
    const theNamespace = namespaces[namespace]
    const systemNames: string[] = []
    const systems: System[] = filterSystems(allSystems, {
      namespace: theNamespace,
    })
    sortedSystems[theNamespace] = []
    for (const i in systems) {
      if (!systemNames.includes(systems[i].name)) {
        systemNames.push(systems[i].name)
        sortedSystems[theNamespace].push(
          filterSystems(systems, {
            name: systems[i].name,
          })
        )
        sortedSystems[theNamespace][
          sortedSystems[theNamespace].length - 1
        ] = sortSystemsVersion(
          sortedSystems[theNamespace][sortedSystems[theNamespace].length - 1]
        )
      }
    }
    sortedSystems[theNamespace].sort((a: System[], b: System[]) =>
      a[0].name > b[0].name ? 1 : -1
    )
  }
  return sortedSystems
}

export default formatSystems
