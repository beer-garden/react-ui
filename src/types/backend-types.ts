import { EmptyObject, ObjectWithStringKeys } from './custom-types'

export interface Command {
  name: string
  description: string
  parameters: Parameter[]
  command_type: CommandType
  output_type: OutputType
  schema: EmptyObject
  form: EmptyObject
  hidden: boolean
  metadata: ObjectWithStringKeys | EmptyObject | null
  template?: string
  icon_name?: string
}

export interface BlockedCommand {
  namespace: string
  system: string
  command: string
  status: StatusType
  id: string
}

export interface BlockedList {
  command_publishing_blocklist: BlockedCommand[]
}

export type StatusType = 'CONFIRMED' | 'ADD_REQUESTED' | 'REMOVE_REQUESTED'
export type CommandType = 'ACTION' | 'INFO'
export type OutputType = 'STRING' | 'JSON' | 'HTML' | 'JS'

export interface ChoiceValueMap {
  value: string | number | boolean
  text: string
}

export interface DynamicChoiceDictionaryValue {
  [key: string]: Array<string>
}

export interface DynamicChoiceCommandValue {
  command: string
  system: string
  version: string
  instance_name: string
}

export interface DynamicChoiceDictionaryDetails {
  key_reference: string
}

export interface DynamicChoiceCommandDetails {
  name: string
  args: Array<string> | Array<Array<string>>
}

export interface DynamicChoiceUrlDetails {
  address: string
  args: Array<Array<string>>
}

export interface Choice {
  display: 'select' | 'typeahead'
  strict: boolean
  type: 'static' | 'command' | 'url'
  value:
    | Array<string | number | boolean | object | null>
    | Array<ChoiceValueMap>
    | DynamicChoiceDictionaryValue
    | DynamicChoiceCommandValue
    | string
  details:
    | DynamicChoiceDictionaryDetails
    | DynamicChoiceCommandDetails
    | DynamicChoiceUrlDetails
    | EmptyObject
}

export type ParameterType =
  | 'Base64'
  | 'Date'
  | 'String'
  | 'Boolean'
  | 'Integer'
  | 'Bytes'
  | 'Any'
  | 'DateTime'
  | 'Float'
  | 'Dictionary'

export interface Parameter {
  key: string
  type: ParameterType
  multi: boolean
  display_name: string
  optional: boolean
  parameters: Parameter[]
  nullable: boolean
  default?: string | boolean | number | object
  description?: string
  choices?: Choice
  maximum?: number
  minimum?: number
  regex?: string
  form_input_type?: 'textarea'
  type_info?: ObjectWithStringKeys | null
}

export type Instance = {
  name: string
  description: string
  id: string
  status: string
  status_info: StatusInfo
  queue_type: string
  queue_info?: ObjectWithStringKeys | null
  icon_name?: string
  metadata?: ObjectWithStringKeys | null
}

export interface StatusInfo {
  heartbeat: number
}

export interface Request {
  children: Request[]
  command: string
  command_type: string
  comment: string | null
  created_at: number
  error_class: Error | null
  has_parent?: boolean
  hidden?: boolean
  id?: string
  instance_name: string
  metadata?: ObjectWithStringKeys | EmptyObject
  namespace: string
  output?: string
  output_type: string
  parameters: Parameter[]
  parent: Request | null
  requester?: string
  status: string
  status_updated_at?: number
  system: string
  system_version: string
  updated_at: number
}

export interface RequestTemplate {
  system: string
  system_version: string
  instance_name: string
  namespace: string
  command: string
  command_type: CommandType
  parameters: ObjectWithStringKeys | EmptyObject
  comment?: string
  metadata?: EmptyObject
  output_type: OutputType
}

export interface System {
  name: string
  description: string
  version: string
  namespace: string
  id: string
  max_instances: number
  instances: Instance[]
  commands: Command[]
  icon_name: string
  display_name: string
  local: boolean
  template: string
  metadata?: ObjectWithStringKeys | EmptyObject
}

export type TriggerType = 'cron' | 'interval' | 'date'

export interface CronTrigger {
  year: string
  month: string
  day: string
  week: string
  day_of_week: string
  hour: string
  minute: string
  second: string
  start_date?: number
  end_date?: number
  timezone: string
  jitter?: number
}

export interface DateTrigger {
  run_date: number
  timezone: string
}

export interface FileTrigger {
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

export type IntervalType = 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks'

export interface IntervalTrigger {
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
  coalesce?: boolean
  error_count?: number
  id: string | null
  max_instances?: number
  misfire_grace_time?: null | number
  name: string
  next_run_time?: number
  request_template: RequestTemplate
  status?: string
  success_count?: number
  timeout?: null | number
  trigger: CronTrigger | DateTrigger | FileTrigger | IntervalTrigger
  trigger_type: TriggerType
}

export interface Garden {
  id?: string
  name: string
  status: string
  status_info?: StatusInfo
  namespaces: string[]
  systems: System[]
  connection_type: string
  connection_params?: ObjectWithStringKeys | EmptyObject | null
}

export interface Queue {
  version: string
  system: string
  size: number
  instance: string
  system_id: string
  display: string
  name: string
}

export interface User {
  id: string
  username: string
  role_assignments: RoleAssignment[]
  permissions: Permissions
  sync_status: SyncStatus | null
}

export interface SyncStatus {
  [key: string]: boolean
}

export interface RoleAssignment {
  domain: RoleAssignmentDomain
  role: Role
}

export type DomainScope = 'Garden' | 'Global' | 'System'
interface RoleAssignmentDomain {
  scope: DomainScope
  identifiers: RoleIdentifier
}

export interface RoleIdentifier {
  name?: string
  namespace?: string
  version?: string
}

export interface Role {
  id: string
  name: string
  permissions: string[]
  sync_status: SyncStatus | null
  description?: string
}

interface Permissions {
  domain_permissions: { [key: string]: DomainPermission }
  global_permissions: string[]
}

export interface DomainPermission {
  system_ids: string[]
  garden_ids: string[]
}
export interface UserPatch {
  role_assignments: RolePatch[]
  password?: string
  hashed_password?: string // not used in UI
}

export interface RolePatch {
  role_name: string
  domain: RoleAssignmentDomain
  role_id?: string
}
