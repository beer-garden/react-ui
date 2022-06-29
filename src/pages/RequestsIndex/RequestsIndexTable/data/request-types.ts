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

type BeergardenRequestParameterChoice = {
  display: string
  strict: boolean
  type: string
  value: any // TODO
  details: any // TODO
}

type BeergardenRequestParameter = {
  key: string
  type: string
  multi: boolean
  display_name: string
  optional: boolean
  default: string
  description: string
  choices: BeergardenRequestParameterChoice
  parameters: BeergardenRequestParameter[]
  nullable: boolean
  maximum: number
  minimum: number
  regex: string
  form_input_type: string | null | undefined
  type_info: any // TODO
}

interface BeergardenRequest {
  children: BeergardenRequest[]
  command: string
  command_type: string
  comment: string | null
  created_at: number
  error_class: Error | null
  has_parent: boolean
  hidden: boolean
  id: string
  instance_name: string
  metadata: any // TODO
  namespace: string
  output: string
  output_type: string
  parameters: BeergardenRequestParameter[]
  parent: BeergardenRequest | null
  requester: string
  status: string
  system: string
  system_version: string
  updated_at: number
}

type RequestsIndexTableData = {
  command: JSX.Element
  namespace: string
  system: string
  version: JSX.Element
  instance: string
  status: string // TODO
  created: string // TODO
  comment: string | null
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
  BeergardenRequest,
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
