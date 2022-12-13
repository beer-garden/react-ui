import {
  BlockedCommand,
  BlockedList,
  Command,
  Instance,
  Parameter,
  System,
} from 'types/backend-types'

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

export const TCommand2 = Object.assign({}, TCommand, {
  name: 'testCommand2',
  description: 'also not blocked',
})

export const TCommand3 = Object.assign({}, TCommand, {
  name: 'testCommand3',
  description: 'for good measure',
})

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

export const TSystem2 = Object.assign({}, TSystem, {
  name: 'testSystem2',
  version: '2.0.0',
  commands: [TCommand2],
})

export const TSystem3 = Object.assign({}, TSystem, {
  name: 'testSystem3',
  namespace: 'newNamespace',
  commands: [TCommand3],
})

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

export const TSystemCommand = {
  namespace: TSystem.namespace,
  system: TSystem.name,
  version: TSystem.version,
  command: TCommand.name,
  description: TCommand.description,
  executeButton: expect.any(Object),
  isHidden: TCommand.hidden,
}

export const TSystemCommand2 = {
  namespace: TSystem2.namespace,
  system: TSystem2.name,
  version: TSystem2.version,
  command: TCommand2.name,
  description: TCommand2.description,
  executeButton: expect.any(Object),
  isHidden: TCommand2.hidden,
}

export const TSystemCommand3 = {
  namespace: TSystem3.namespace,
  system: TSystem3.name,
  version: TSystem3.version,
  command: TCommand3.name,
  description: TCommand3.description,
  executeButton: expect.any(Object),
  isHidden: TCommand3.hidden,
}
