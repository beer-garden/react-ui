import {
  BlockedCommand,
  BlockedList,
  Command,
  DateTrigger,
  Instance,
  Job,
  Parameter,
  Queue,
  Request,
  RequestTemplate,
  System,
} from 'types/backend-types'
import { AugmentedCommand } from 'types/custom-types'

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

export const TJob: Job = {
  coalesce: false,
  error_count: 0,
  id: '123test',
  max_instances: 1,
  misfire_grace_time: null,
  name: 'testjob',
  next_run_time: 1,
  request_template: {
    namespace: TSystem.namespace,
    system: TSystem.name,
    command: TCommand.name,
    instance_name: TInstance.name,
    system_version: TSystem.version,
  } as RequestTemplate,
  status: 'RUNNING',
  success_count: 1,
  timeout: null,
  trigger: {} as DateTrigger,
  trigger_type: 'date',
}

export const TAugmentedCommand: AugmentedCommand = Object.assign({}, TCommand, {
  namespace: 'someNamespace',
  systemName: TSystem.name,
  systemVersion: TSystem.version,
  systemId: TSystem.id,
})

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

export const TRequest: Request = {
  children: [],
  command: 'test command',
  command_type: 'test command type',
  comment: 'test comment',
  created_at: 1667517166106,
  error_class: null,
  id: '1234',
  instance_name: 'test instance',
  namespace: 'test namespace',
  output: 'test output',
  output_type: 'STRING',
  parameters: {},
  parent: null,
  status: 'SUCCESS',
  system: 'test system',
  system_version: 'test version',
  updated_at: 1667517254662,
}

export const TChildRequest: Request = {
  children: [],
  command: 'child command',
  command_type: 'child command type',
  comment: 'child comment',
  created_at: 1667517167106,
  error_class: null,
  id: 'child1234',
  instance_name: 'child instance',
  namespace: 'child namespace',
  output: 'child output',
  output_type: 'STRING',
  parameters: {},
  parent: TRequest,
  status: 'ERROR',
  system: 'child system',
  system_version: 'child version',
  updated_at: 1667517244664,
}
