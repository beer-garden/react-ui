import {
  BlockedCommand,
  BlockedList,
  Command,
  DateTrigger,
  Instance,
  Job,
  Parameter,
  Queue,
  RequestTemplate,
  System,
} from 'types/backend-types'

export const TServerConfig = {
  application_name: 'testApp',
  auth_enabled: false,
  trusted_header_auth_enabled: false,
  icon_default: 'none',
  debug_mode: false,
  execute_javascript: false,
  garden_name: 'testGarden',
  metrics_url: '/metrics',
  url_prefix: '/',
}

export const TServerAuthConfig = {
  application_name: 'testApp',
  auth_enabled: true,
  trusted_header_auth_enabled: false,
  icon_default: 'none',
  debug_mode: false,
  execute_javascript: false,
  garden_name: 'testGarden',
  metrics_url: '/metrics',
  url_prefix: '/',
}

export const TVersionConfig = {
  beer_garden_version: '1.0.0',
  current_api_version: '1.0.1',
  supported_api_versions: ['1.0.0', '1.0.1'],
}

export const TJob: Job = {
  coalesce: false,
  error_count: 0,
  id: '123test',
  max_instances: 1,
  misfire_grace_time: null,
  name: 'testjob',
  next_run_time: 1,
  request_template: {} as RequestTemplate,
  status: 'RUNNING',
  success_count: 1,
  timeout: null,
  trigger: {} as DateTrigger,
  trigger_type: 'date',
}

export const TInstance: Instance = {
  description: 'testing an instance',
  id: 'testinst',
  name: 'testInstance',
  status: 'RUNNING',
  status_info: { heartbeat: 67 },
  queue_type: 'queued',
}

export const TInstance2: Instance = {
  description: 'another instance to test',
  id: 'secondInst',
  name: 'secondInstance',
  status: 'INITIALIZING',
  status_info: { heartbeat: 70 },
  queue_type: 'queued',
}

export const TLog =
  'This is a test log\nMultiples line items\nJust to test with'

export const TParameter: Parameter = {
  key: 'testParam',
  type: 'String',
  multi: false,
  display_name: 'test param',
  optional: true,
  parameters: [],
  nullable: false,
}

export const TCommand: Command = {
  name: 'testCommand',
  description: 'test not blocked',
  parameters: [TParameter],
  command_type: 'INFO',
  output_type: 'JSON',
  schema: {},
  form: {},
  hidden: false,
  metadata: null,
}

export const TSystem: System = {
  name: 'testSystem',
  description: 'testing a system',
  version: '1.0.0',
  namespace: 'test',
  id: 'testsys',
  max_instances: 5,
  instances: [TInstance],
  commands: [TCommand],
  icon_name: 'trashcan',
  display_name: 'Test System',
  local: false,
  template: 'template',
}

export const TQueue: Queue = {
  version: '1.0.2',
  system: 'default',
  size: 568,
  instance: TInstance.id,
  system_id: TSystem.id,
  display: 'Test Queue',
  name: 'testQ',
}

export const TBlockedCommand: BlockedCommand = {
  namespace: 'testNamespace',
  system: 'testSystem',
  command: 'testCommand',
  status: 'CONFIRMED',
  id: 'testBlocked',
}

export const TBlocklist: BlockedList = {
  command_publishing_blocklist: [TBlockedCommand],
}
