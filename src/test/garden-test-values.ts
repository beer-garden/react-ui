import { TSystem } from 'test/test-values'
import { Garden, System } from 'types/backend-types'

export const TGarden: Garden = {
  id: 'localGarden',
  name: 'testGarden',
  namespaces: ['basic'],
  status: 'RUNNING',
  status_info: { heartbeat: 3000 },
  systems: [TSystem, { name: 'fakeSystem' } as System],
  connection_type: 'HTTP',
}

export const TGardenSync = {
  gardenOne: true,
  gardenTwo: false,
}
