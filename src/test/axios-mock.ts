import axios, { AxiosRequestConfig } from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { TGarden } from 'test/garden-test-values'
import {
  TBlockedCommand,
  TBlocklist,
  TInstance,
  TRunner,
  TSystem,
} from 'test/system-test-values'
import * as mockData from 'test/test-values'
import { TAdmin, TAdminRole, TRole, TUser } from 'test/user-test-values'

axios.defaults.baseURL = 'http://localhost:4000'

const mock = new MockAdapter(axios)

const regexLogs = new RegExp(/(\/api\/v1\/instances\/)\w+(\/logs)/)
export const regexUsers = new RegExp(/(\/api\/v1\/users\/)\w+/)
const regexQueues = new RegExp(/(\/api\/v1\/instances\/)(\w+[^bad])(\/queues)/)

// Success GET
mock.onGet('/config').reply(200, mockData.TServerConfig)
mock.onGet('/version').reply(200, mockData.TVersionConfig)
mock.onGet('/api/v1/jobs').reply(200, [mockData.TJob])
mock.onGet(`/api/v1/jobs/${mockData.TJob.id}`).reply(200, mockData.TJob)
mock.onGet('/api/v1/gardens').reply(200, [TGarden])
mock.onGet('/api/v1/commandpublishingblocklist').reply(200, TBlocklist)
mock.onGet('/api/v1/systems').reply(200, [TSystem])
mock.onGet('/api/v1/users').reply(200, { users: [TUser] })
mock.onGet(regexUsers).reply(200, TUser)
mock.onGet('/api/v1/roles').reply(200, { roles: [TRole, TAdminRole] })
mock.onGet('/api/v1/requests/1234').reply(200, mockData.TRequest)
mock.onGet('/api/v1/namespaces').reply(200, ['test'])
mock.onGet('/api/v1/users/adminUser').reply((config: AxiosRequestConfig) => {
  // this can be updated to be dynamic by parsing config.url for name
  return [200, { users: [TAdmin] }]
})
mock.onGet(regexLogs).reply(200, mockData.TLog, { request_id: 'fetchedLog' })
mock.onGet(regexQueues).reply(200, [mockData.TQueue])
mock.onGet('/api/v1/instances/testinst').reply(200, TInstance)
mock.onGet('/api/vbeta/runners').reply(200, [TRunner])

// Fail GET
mock
  .onGet('/api/v1/instances/bad/queues')
  .reply(404, { message: 'Failure to return queue' })

// Success POST
mock.onPost('/api/v1/requests').reply(200, { id: 'testRequest' })
mock.onPost('/api/v1/token').reply(200, { access: 'admin', refresh: 'none' })
mock.onPost('/api/v1/users').reply(200, { users: [TAdmin] })
mock.onPost('/api/v1/import/jobs').reply(200, { ids: [mockData.TJob.id] })
mock.onPost('/api/v1/export/jobs').reply(200, [mockData.TJob])
mock.onPost('/api/v1/jobs').reply(200, mockData.TJob)
mock.onPost(`/api/v1/jobs/${mockData.TJob.id}/execute`).reply(200, {})
mock.onPost('/api/v1/commandpublishingblocklist').reply(200, TBlocklist)

// Success PATCH
mock.onPatch('/api/v1/gardens').reply(200, {})
mock.onPatch(regexUsers).reply(200, TUser)
mock.onPatch('/api/v1/instances/testinst').reply(200, TInstance)
mock
  .onPatch(`/api/v1/jobs/${mockData.TJob.id}`)
  .reply((config: AxiosRequestConfig) => {
    const data = JSON.parse(config.data)
    if (data.operations[0].value === 'PAUSED') {
      return [200, mockData.TJob]
    }
    return [200, Object.assign({}, mockData.TJob, { status: 'PAUSED' })]
  })
mock.onPatch('/api/v1/systems/testsys').reply(200, '')
mock.onPatch('/api/vbeta/runners').reply(200, [TRunner])

// Success DELETE
mock.onDelete(regexUsers).reply(204, '')
mock.onDelete(`/api/v1/jobs/${mockData.TJob.id}`).reply(204, '')
mock.onDelete('/api/v1/systems/testsys').reply(204)
mock
  .onDelete(`/api/v1/commandpublishingblocklist/${TBlockedCommand.id}`)
  .reply(204, TBlockedCommand)
mock.onDelete(`/api/vbeta/runners/${TRunner.id}`).reply(200, TRunner)

// default
mock.onAny().reply(200, 'undefined axios mock - add to axios-mock.ts')

export { mock as mockAxios }
