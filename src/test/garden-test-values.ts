import { TSystem, TSystem2 } from 'test/system-test-values'
import { Garden } from 'types/backend-types'

export const TGarden: Garden = {
  id: 'remoteGarden',
  name: 'testGarden',
  namespaces: ['basic'],
  status: 'RUNNING',
  status_info: { heartbeat: 3000 },
  systems: [TSystem, TSystem2],
  connection_type: 'HTTP',
}

export const TGardenSync = {
  gardenOne: true,
  gardenTwo: false,
}
