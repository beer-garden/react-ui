import {
  OrderableColumnDirection,
  RequestsSearchApi,
} from 'types/request-types'

import {
  baseSearchApi,
  defaultColumnsData,
  defaultOrderingColumnIndex,
  getUrlFromSearchApi,
} from './base-search-api'

describe('base search api', () => {
  describe('baseSearchApi', () => {
    test('provides default', () => {
      expect(baseSearchApi).toMatchObject({
        columns: expect.any(Array),
        draw: 1,
        includeChildren: false,
        includeHidden: false,
        length: 10,
        order: {
          column: 6,
          dir: 'desc' as OrderableColumnDirection,
        },
        search: { value: '', regex: false },
        start: 0,
      })
    })
  })

  test('defaultColumnsData', () => {
    const searchable = [
      'command',
      'namespace',
      'system',
      'system_version',
      'instance_name',
      'status',
      'created_at',
      'comment',
      'metadata',
    ].map((col) => {
      return {
        data: col,
        name: '',
        searchable: true,
        orderable: true,
        search: { value: '', regex: false },
      }
    })
    expect(defaultColumnsData).toMatchObject([
      ...searchable,
      { data: 'id' },
      { data: 'parent' },
      { data: 'hidden' },
    ])
  })

  test('defaultOrderingColumnIndex', () => {
    expect(defaultOrderingColumnIndex).toEqual(6)
  })

  describe('getUrlFromSearchApi', () => {
    test('generates base url if no keys', () => {
      const result = getUrlFromSearchApi({} as RequestsSearchApi)
      expect(result).toEqual('/api/v1/requests?')
    })

    test('generates url based on keys', () => {
      const result = getUrlFromSearchApi({
        draw: 4,
        start: 2,
      } as RequestsSearchApi)
      expect(result).toEqual('/api/v1/requests?draw=4&start=2&')
    })

    test('special handling for columns (unsearchable)', () => {
      const result = getUrlFromSearchApi({
        columns: [{ data: 'id' }],
      } as RequestsSearchApi)
      expect(result).toEqual('/api/v1/requests?columns=%7B"data":"id"%7D&')
    })

    test('special handling for columns (searchable)', () => {
      const col = {
        data: 'system',
        name: 'testCol',
        searchable: true,
        orderable: false,
        search: { value: 'test', regex: false },
      }
      const result = getUrlFromSearchApi({
        columns: [col],
      } as RequestsSearchApi)
      expect(result).toEqual(
        '/api/v1/requests?columns=%7B"data":"system","name":"testCol","searchable"' +
          ':true,"orderable":false,"search":%7B"value":"test","regex":false%7D%7D&',
      )
    })

    test('special handling for length', () => {
      const result = getUrlFromSearchApi({ length: 42 } as RequestsSearchApi)
      expect(result).toEqual('/api/v1/requests?length=10&')
      window.localStorage.setItem(
        'tableState:Requests',
        JSON.stringify({ pageSize: 12 }),
      )
      const secondResult = getUrlFromSearchApi({
        length: 42,
      } as RequestsSearchApi)
      expect(secondResult).toEqual('/api/v1/requests?length=12&')
    })
  })
})
