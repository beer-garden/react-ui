import { Filters } from 'react-table'
import { RequestsIndexTableData, RequestsSearchApi } from 'types/request-types'

import { updateApiSearchBy } from './search-api-helpers'

describe('updateApiSearchBy', () => {
  test('handles instance correctly', () => {
    const api = {} as RequestsSearchApi
    const testValue = 'MyFavoriteInstanceFilterValue'
    const filters = [
      { id: 'instance', value: testValue },
    ] as Filters<RequestsIndexTableData>

    const resultColumn = updateApiSearchBy(api, filters)
      .columns.filter((c) => c.data === 'instance_name')
      .pop()
    expect(resultColumn).not.toBeUndefined()

    const searchParameters = resultColumn?.search
    expect(searchParameters).not.toBeUndefined()

    expect(searchParameters).toMatchObject({
      value: testValue,
    })
  })

  test('handles version correctly', () => {
    const api = {} as RequestsSearchApi
    const testValue = 'MyFavoriteVersionFilterValue'
    const filters = [
      { id: 'version', value: testValue },
    ] as Filters<RequestsIndexTableData>

    const resultColumn = updateApiSearchBy(api, filters)
      .columns.filter((c) => c.data === 'system_version')
      .pop()
    expect(resultColumn).not.toBeUndefined()

    const searchParameters = resultColumn?.search
    expect(searchParameters).not.toBeUndefined()

    expect(searchParameters).toMatchObject({
      value: testValue,
    })
  })
})
