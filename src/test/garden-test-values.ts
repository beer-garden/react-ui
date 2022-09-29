import { TSystem } from 'test/test-values'
import { Garden } from 'types/backend-types'

export const TGarden: Garden = {
  id: 'localGarden',
  name: 'testGarden',
  namespaces: ['basic'],
  status: 'RUNNING',
  status_info: { heartbeat: 3000 },
  systems: [TSystem],
  connection_type: 'HTTP',
}
