import {
  ColumnData,
  OrderableColumnDirection,
  OrderableColumnIndex,
  RequestsSearchApi,
  SearchableColumn,
  SearchableColumnData,
  UnsearchableColumn,
} from './request-types'

const searchableColumnData: SearchableColumnData[] = [
  'command',
  'namespace',
  'system',
  'system_version',
  'instance_name',
  'status',
  'created_at',
  'comment',
  'metadata',
]

const defaultOrderingColumnIndex = searchableColumnData.indexOf(
  'created_at',
) as OrderableColumnIndex

const searchableColumnMapper = (
  columnName: SearchableColumnData,
): SearchableColumn => {
  return {
    data: columnName,
    name: '',
    searchable: true,
    orderable: true,
    search: { value: '', regex: false },
  }
}

const searchableColumns = searchableColumnData.map(searchableColumnMapper)
const unsearchableColumns: UnsearchableColumn[] = [
  { data: 'id' },
  { data: 'parent' },
  { data: 'hidden' },
]
const defaultColumnsData: ColumnData[] = [
  ...searchableColumns,
  ...unsearchableColumns,
]

/**
 * Vanilla requests search api
 */
const baseSearchApi: RequestsSearchApi = {
  columns: defaultColumnsData,
  draw: 1,
  includeChildren: false,
  includeHidden: false,
  length: 10,
  order: {
    column: defaultOrderingColumnIndex,
    dir: 'desc' as OrderableColumnDirection,
  },
  search: { value: '', regex: false },
  start: 0,
}

const updateUrlFromColumns = (url: string, columns: ColumnData[]) => {
  return url.concat(
    columns
      .map((c) => {
        return `columns=${JSON.stringify(c)}&`
      })
      .join('')
      .replace('{', '%7B')
      .replace('}', '%7D'),
  )
}

const getUrlFromSearchApi = (searchApi: RequestsSearchApi) => {
  let url = '/api/v1/requests?'

  for (const key in searchApi) {
    if (key === 'columns') {
      url = updateUrlFromColumns(url, searchApi[key])
    } else {
      let realKey /* the 'includes' are corner cases */

      if (key === 'includeChildren') realKey = 'include_children'
      else if (key === 'includeHidden') realKey = 'include_hidden'
      else realKey = key

      url = url.concat(`${realKey}=${JSON.stringify(searchApi[key])}&`)
    }
  }

  const newUrl = url.replace('{', '%7B').replace('}', '%7D')

  return newUrl
}

export {
  baseSearchApi,
  getUrlFromSearchApi,
  defaultColumnsData,
  defaultOrderingColumnIndex,
}
