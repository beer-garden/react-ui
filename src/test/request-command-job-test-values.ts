import { TCommand, TSystem } from 'test/system-test-values'
import { RequestTemplate } from 'types/backend-types'
import { AugmentedCommand } from 'types/custom-types'

export const TAugmentedCommand: AugmentedCommand = {
  ...TCommand,
  namespace: TSystem.namespace,
  systemName: TSystem.name,
  systemVersion: TSystem.version,
  systemId: TSystem.id,
}

export const TRequestCommandModel: RequestTemplate = {
  system: TSystem.name,
  system_version: TSystem.version,
  namespace: TSystem.namespace,
  command: TSystem.commands[0].name,
  comment: 'Silly comment!',
  output_type: TSystem.commands[0].output_type,
  instance_name: TSystem.instances[0].name,
  parameters: {
    [TAugmentedCommand.parameters[0].key]: 'This is a parameter value',
  },
}
