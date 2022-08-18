import { AxiosResponse } from 'axios'

import { Command, Job, System } from './backend-types'

export interface ObjectWithStringKeys {
  [key: string]: unknown
}

export type EmptyObject = Record<string, never>

export interface SuccessCallback {
  (response: AxiosResponse): void
}

export interface TableState {
  tableHeads: string[]
  completeDataSet?: System[] | Command[] | Request[] | Job[]
  redirect?: JSX.Element | null
  formatData?(
    data?: System[] | Command[] | Request[] | Job[],
  ): (string | JSX.Element | number | null)[][]
  setSearchApi?(value: string, id: string, setDateEnd?: boolean): void
  apiDataCall?(
    page: number,
    rowsPerPage: number,
    successCallback: SuccessCallback,
  ): void
  getCellButton?(system: System): JSX.Element
  includeChildren?: boolean
  cacheKey?: string
  includePageNav: boolean
  disableSearch: boolean
}

export interface IdParam {
  id: string
}

export interface GardenNameParam {
  garden_name: string
}

export interface RequestSearchApiColumnSearch {
  [index: string]: string | boolean
  value: string
  regex: boolean
}

export interface RequestSearchApiColumn {
  [index: string]: string | boolean | undefined | RequestSearchApiColumnSearch
  data: string
  name?: string
  searchable?: boolean
  orderable?: boolean
  search?: { value: string; regex: boolean }
}

export interface RequestSearchApiOrder {
  [index: string]: string | number
  column: number
  dir: string
}

export interface RequestSearchApiSearch {
  value: string
  regex: boolean
}

export interface RequestsSearchApi {
  [index: string]:
    | RequestSearchApiColumn[]
    | number
    | boolean
    | RequestSearchApiOrder[]
    | RequestSearchApiSearch
  columns: RequestSearchApiColumn[]
  draw: number
  include_children: boolean
  length: number
  order: RequestSearchApiOrder[]
  search: RequestSearchApiSearch
  start: number
}

export interface CommandParams {
  command_name: string
  namespace: string
  system_name: string
  version: string
}

export interface TableInterface {
  parentState: TableState
}
