type SearchableColumnData =
  | 'command'
  | 'namespace'
  | 'system'
  | 'system_version'
  | 'instance_name'
  | 'status'
  | 'created_at'
  | 'comment'
  | 'metadata'

type OrderableColumnIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
type OrderableColumnDirection = 'asc' | 'desc'
type UnsearchableColumnData = 'id' | 'parent' | 'hidden'
type SearchParameters = { value: string; regex: boolean }

interface SearchableColumn {
  [index: string]: SearchableColumnData | string | boolean | SearchParameters
  data: SearchableColumnData
  name: string
  searchable: boolean
  orderable: boolean
  search: SearchParameters
}

interface SearchFilter {
  id: SearchableColumnData
  value: string
}

interface UnsearchableColumn {
  [index: string]: UnsearchableColumnData
  data: UnsearchableColumnData
}

type ColumnData = SearchableColumn | UnsearchableColumn

interface RequestSearchApiSearch {
  value: string
  regex: boolean
}

interface RequestSearchApiOrder {
  column: OrderableColumnIndex
  dir: OrderableColumnDirection
}

interface RequestsSearchApi {
  [index: string]:
    | ColumnData[]
    | number
    | boolean
    | RequestSearchApiOrder
    | RequestSearchApiSearch
  columns: ColumnData[]
  draw: number
  includeChildren: boolean
  includeHidden: boolean
  length: number
  order: RequestSearchApiOrder
  search: RequestSearchApiSearch
  start: number
}

type RequestsIndexTableData = {
  command: string
  namespace: string
  system: string
  version: string
  instance: string
  status: string // TODO
  created: string // TODO
  comment: string | null
  commandLink?: string
  versionLink: string
  id?: string
  parentId?: string
  parentCommand?: string
  hasParent: boolean
  isHidden: boolean
}

type RequestsIndexTableHeaders = {
  [index: string]: number | undefined
  start: number
  length: number
  requested: number
  recordsFiltered: number
  recordsTotal: number
  draw: number | undefined
}

export type {
  ColumnData,
  OrderableColumnDirection,
  OrderableColumnIndex,
  RequestsIndexTableData,
  RequestsIndexTableHeaders,
  RequestsSearchApi,
  SearchableColumn,
  SearchableColumnData,
  SearchFilter,
  UnsearchableColumn,
}
