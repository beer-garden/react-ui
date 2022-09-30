import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import * as mockData from './test-values'
import { TAdmin, TUser } from './user-test-values'

axios.defaults.baseURL = 'http://localhost:4000'

const mock = new MockAdapter(axios)

const regexLogs = new RegExp(/(\/api\/v1\/instances\/)\w+(\/logs)/)
const regexQueues = new RegExp(/(\/api\/v1\/instances\/)(\w+[^bad])(\/queues)/)

// Success GET
mock.onGet('/config').reply(200, mockData.TServerConfig)
mock.onGet('/version').reply(200, mockData.TVersionConfig)
mock.onGet('/api/v1/jobs').reply(200, mockData.TJob)
mock.onGet('/api/v1/commandpublishingblocklist').reply(200, mockData.TBlocklist)
mock.onGet('/api/v1/systems').reply(200, [mockData.TSystem])
mock.onGet('/api/v1/users').reply(200, { users: [TUser] })
mock.onGet(regexLogs).reply(200, mockData.TLog, { request_id: 'fetchedLog' })
mock.onGet(regexQueues).reply(200, [mockData.TQueue])

// Fail GET
mock
  .onGet('/api/v1/instances/bad/queues')
  .reply(404, { message: 'Failure to return queue' })

// Success POST
mock.onPost('/api/v1/requests').reply(200, { id: 'testRequest' })
mock.onPost('/api/v1/token').reply(200, { access: 'admin', refresh: 'none' })
mock.onPost('/api/v1/users').reply(200, { users: [TAdmin] })

// default
mock.onAny().reply(200, undefined)

export { mock as mockAxios }
