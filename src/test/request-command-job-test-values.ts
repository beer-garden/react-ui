import { TCommand, TSystem } from 'test/system-test-values'
import { AugmentedCommand } from 'types/custom-types'
import {
  CommandViewJobModel,
  CommandViewRequestModel,
} from 'types/form-model-types'

export const TAugmentedCommand: AugmentedCommand = {
  ...TCommand,
  namespace: TSystem.namespace,
  systemName: TSystem.name,
  systemVersion: TSystem.version,
  systemId: TSystem.id,
}

export const TRequestCommandModel: CommandViewRequestModel = {
  comment: {
    comment: 'Silly comment!',
  },
  instance_names: {
    instance_name: TSystem.instances[0].name,
  },
  parameters: {
    [TAugmentedCommand.parameters[0].key]: 'This is a parameter value',
  },
}

export const TRequestJobModel: CommandViewJobModel = {
  comment: {
    comment: 'Silly JOB comment!',
  },
  instance_names: {
    instance_name: TSystem.instances[0].name,
  },
  parameters: {
    [TAugmentedCommand.parameters[0].key]: 'This is a JOB parameter value',
  },
  job: {
    name: 'My favorite job',
    trigger: 'date',
    timezone: 'UTC'
  },
}
