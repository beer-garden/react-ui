import { AxiosResponse } from 'axios'

export type Dictionary = {
  [key: string]: any
}

export type Command = {
  name: string
  description: string
  parameters: Parameter[]
  command_type: string
  output_type: string
  template: string
  icon_name: string
  hidden: boolean
  systemVersion: string
  systemName: string
  namespace: string
  schema: any
  form: any
  metadata: any
}

export type Choice = {
  display: string
  strict: boolean
  type: string
  value: any
  details: any
}

export type Parameter = {
  key: string
  type: string
  multi: boolean
  display_name: string
  optional: boolean
  default: string
  description: string
  choices: Choice
  parameters: Parameter[]
  nullable: boolean
  maximum: number
  minimum: number
  regex: string
  form_input_type: string | null | undefined
  type_info: any
}

export type Instance = {
  name: string
  description: string
  id: string
  status: string
  status_info: any
  queue_type: string
  queue_info: any
  icon_name: string
  metadata: any
}

export type System = {
  name: string
  description: string
  version: string
  id: string
  max_instances: number
  instances: Instance[]
  commands: Command[]
  icon_name: string
  display_name: string
  metadata: any
  namespace: string
  local: boolean
  template: string
}

export interface Request {
  children: Request[]
  command: string
  command_type: string
  comment: string | null
  created_at: number
  error_class: Error | null
  has_parent: boolean
  hidden: boolean
  id: string
  instance_name: string
  metadata: any
  namespace: string
  output: string
  output_type: string
  parameters: Parameter[]
  parent: Request | null
  requester: string
  status: string
  system: string
  system_version: string
  updated_at: number
}

interface CronTrigger {
  year: string
  month: string
  day: string
  week: string
  day_of_week: string
  hour: string
  minute: string
  second: string
  start_date: number
  end_date: number
  timezone: string
  jitter: number
}

export interface DateTrigger {
  run_date: number
  timezone: string
}

interface FileTrigger {
  pattern: string[]
  path: string
  recursive: boolean
  callbacks: {
    on_created: boolean
    on_modified: boolean
    on_moved: boolean
    on_deleted: boolean
  }
}

interface IntervalTrigger {
  weeks: number
  days: number
  hours: number
  minutes: number
  seconds: number
  start_date: number
  end_date: number
  timezone: string
  jitter: number
  reschedule_on_finish: boolean
}

export interface Job {
  coalesce: boolean
  error_count: number
  id: string
  max_instances: number
  misfire_grace_time: null | number
  name: string
  next_run_time: number
  request_template: Request
  status: string
  success_count: number
  timeout: null | number
  trigger: CronTrigger | DateTrigger | FileTrigger | IntervalTrigger
  trigger_type: string
}

export interface Garden {
  id: string
  name: string
  status: string
  status_info: any
  namespaces: string[]
  systems: System[]
  connection_type: string
  connection_params: any
}

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
