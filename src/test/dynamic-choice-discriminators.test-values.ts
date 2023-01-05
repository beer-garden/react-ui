import { Choice, Command, Parameter } from 'types/backend-types'

export const paramNoChoices: Parameter = {
  key: 'paramKey',
  type: 'String',
  multi: false,
  display_name: 'paramDisplayName',
  optional: false,
  parameters: [],
  nullable: true,
  choices: undefined,
}

export const staticChoice: Choice = {
  display: 'select',
  strict: true,
  type: 'static',
  value: ['a', 'b', 'c'],
  details: {},
}

export const paramWithStaticChoice: Parameter = {
  ...paramNoChoices,
  choices: staticChoice,
}

export const dictWithDynamicInstanceKeyCommand: Command = {
  name: 'say_specific_dictionary_with_instance_name_key',
  description:
    'Uses the instance name as the key_reference for the choices dictionary',
  parameters: [
    {
      key: 'message',
      type: 'String',
      multi: false,
      display_name: 'message',
      optional: false,
      description: 'I depend on the instance',
      choices: {
        display: 'select',
        strict: true,
        type: 'static',
        value: {
          d1: ['100', '101', '111'],
          d2: ['200', '202', '222'],
        },
        details: {
          key_reference: 'instance_name',
        },
      },
      nullable: true,
      type_info: {},
      parameters: [],
    },
  ],
  command_type: 'ACTION',
  output_type: 'STRING',
  schema: {},
  form: {},
  hidden: false,
  metadata: {},
}

export const dictWithDynamicNonInstanceKeyCommand: Command = {
  name: 'say_specific_dictionary_with_key_reference',
  description:
    'Uses the dict_key param as the key_reference for the choices dictionary',
  parameters: [
    {
      key: 'dict_key',
      type: 'String',
      multi: false,
      display_name: 'dict_key',
      optional: true,
      choices: {
        display: 'select',
        strict: true,
        type: 'static',
        value: ['a', 'b', 'c', null],
        details: {},
      },
      nullable: true,
      type_info: {},
      parameters: [],
    },
    {
      key: 'message',
      type: 'String',
      multi: false,
      display_name: 'message',
      optional: false,
      description: 'I depend on "dict_key"',
      choices: {
        display: 'select',
        strict: true,
        type: 'static',
        value: {
          a: ['r', 's', 't'],
          b: ['u', 'v', 'w'],
          c: ['x', 'y', 'z'],
          null: [
            'r',
            's',
            't',
            'u',
            'v',
            'w',
            'x',
            'y',
            'z',
            'r',
            's',
            't',
            'u',
            'v',
            'w',
            'x',
            'y',
            'z',
          ],
        },
        details: {
          key_reference: 'dict_key',
        },
      },
      nullable: true,
      type_info: {},
      parameters: [],
    },
  ],
  command_type: 'ACTION',
  output_type: 'STRING',
  schema: {},
  form: {},
  hidden: false,
  metadata: {},
}

export const simpleDynamicCommand: Command = {
  name: 'say_specific_from_command',
  description: 'Uses the "get_choices" command to populate choices',
  parameters: [
    {
      key: 'message',
      type: 'String',
      multi: false,
      display_name: 'message',
      optional: false,
      description: 'Say what we want',
      choices: {
        display: 'typeahead',
        strict: true,
        type: 'command',
        value: 'get_choices',
        details: {
          name: 'get_choices',
          args: [],
        },
      },
      nullable: false,
      type_info: {},
      parameters: [],
    },
  ],
  command_type: 'ACTION',
  output_type: 'STRING',
  schema: {},
  form: {},
  hidden: false,
  metadata: {},
}

export const simpleDynamicCommandFullySpecified: Command = {
  name: 'say_specific_from_command_fully_specified',
  description: 'Choices param is the fully-specified dictionary',
  parameters: [
    {
      key: 'message',
      type: 'String',
      multi: false,
      display_name: 'message',
      optional: false,
      description: 'Say what we want',
      choices: {
        display: 'select',
        strict: true,
        type: 'command',
        value: {
          command: 'get_choices',
          system: 'dynamic',
          version: '1.0.0.dev',
          instance_name: 'default',
        },
        details: {
          name: 'get_choices',
          args: [],
        },
      },
      nullable: false,
      type_info: {},
      parameters: [],
    },
  ],
  command_type: 'ACTION',
  output_type: 'STRING',
  schema: {},
  form: {},
  hidden: false,
  metadata: {},
}

export const simpleDynamicCommandWithTypeahead: Command = {
  name: 'say_specific_from_command_nullable',
  description: 'Uses the "get_choices" command to populate choices',
  parameters: [
    {
      key: 'message',
      type: 'String',
      multi: false,
      display_name: 'message',
      optional: false,
      description: 'Say what we want',
      choices: {
        display: 'typeahead',
        strict: true,
        type: 'command',
        value: 'get_choices',
        details: {
          name: 'get_choices',
          args: [],
        },
      },
      nullable: true,
      type_info: {},
      parameters: [],
    },
  ],
  command_type: 'ACTION',
  output_type: 'STRING',
  schema: {},
  form: {},
  hidden: false,
  metadata: {},
}

export const simpleDynamicUrl: Command = {
  name: 'say_specific_from_url',
  description: 'Uses a URL pointing to a JSON file to populate choices',
  parameters: [
    {
      key: 'message',
      type: 'String',
      multi: false,
      display_name: 'message',
      optional: false,
      description: 'Say what we want',
      choices: {
        display: 'typeahead',
        strict: true,
        type: 'url',
        value: 'http://example.com/api/choices.json',
        details: {
          address: 'http://example.com/api/choices.json',
          args: [],
        },
      },
      nullable: false,
      type_info: {},
      parameters: [],
    },
  ],
  command_type: 'ACTION',
  output_type: 'STRING',
  schema: {},
  form: {},
  hidden: false,
  metadata: {},
}

export const simpleDynamicUrlNullable: Command = {
  name: 'say_specific_from_url_nullable',
  description: 'Uses a URL pointing to a JSON file to populate choices',
  parameters: [
    {
      key: 'message',
      type: 'String',
      multi: false,
      display_name: 'message',
      optional: false,
      description: 'Say what we want',
      choices: {
        display: 'typeahead',
        strict: true,
        type: 'url',
        value: 'http://example.com/api/choices.json',
        details: {
          address: 'http://example.com/api/choices.json',
          args: [],
        },
      },
      nullable: true,
      type_info: {},
      parameters: [],
    },
  ],
  command_type: 'ACTION',
  output_type: 'STRING',
  schema: {},
  form: {},
  hidden: false,
  metadata: {},
}

export const dynamicUrlWithSingleParameter: Command = {
  name: 'say_specific_from_url_with_parameter',
  description: 'Uses URL and query parameter to populate choices',
  parameters: [
    {
      key: 'file',
      type: 'String',
      multi: false,
      display_name: 'file',
      optional: true,
      default: 'a',
      choices: {
        display: 'select',
        strict: true,
        type: 'static',
        value: ['a', 'b', 'c'],
        details: {},
      },
      nullable: false,
      type_info: {},
      parameters: [],
    },
    {
      key: 'message',
      type: 'String',
      multi: false,
      display_name: 'message',
      optional: false,
      description: 'Say what we want',
      choices: {
        display: 'select',
        strict: true,
        type: 'url',
        //eslint-disable-next-line no-template-curly-in-string
        value: 'http://example.com/api?file=${file}',
        details: {
          address: 'http://example.com/api',
          args: [['file', 'file']],
        },
      },
      nullable: false,
      type_info: {},
      parameters: [],
    },
  ],
  command_type: 'ACTION',
  output_type: 'STRING',
  schema: {},
  form: {},
  hidden: false,
  metadata: {},
}

export const dynamicCommandWithSingleParameter: Command = {
  name: 'say_specific_with_choices_argument',
  description:
    'Calls "get_choices_with_argument" with "index" param to populate choices',
  parameters: [
    {
      key: 'index',
      type: 'String',
      multi: false,
      display_name: 'index',
      optional: true,
      default: 'a',
      choices: {
        display: 'select',
        strict: true,
        type: 'static',
        value: ['a', 'b', 'c'],
        details: {},
      },
      nullable: false,
      type_info: {},
      parameters: [],
    },
    {
      key: 'message',
      type: 'String',
      multi: false,
      display_name: 'message',
      optional: false,
      description: 'Say what we want',
      choices: {
        display: 'select',
        strict: true,
        type: 'command',
        // eslint-disable-next-line no-template-curly-in-string
        value: 'get_choices_with_argument(key=${index})',
        details: {
          name: 'get_choices_with_argument',
          args: [['key', 'index']],
        },
      },
      nullable: false,
      type_info: {},
      parameters: [],
    },
  ],
  command_type: 'ACTION',
  output_type: 'STRING',
  schema: {},
  form: {},
  hidden: false,
  metadata: {},
}

export const dynamicCommandWithMultipleParameters: Command = {
  name: 'say_specific_with_choices_arguments',
  description: 'Calls "get_choices_with_arguments" with "p1" and "p2" params',
  parameters: [
    {
      key: 'p1',
      type: 'String',
      multi: false,
      display_name: 'p1',
      optional: true,
      default: 'a',
      choices: {
        display: 'select',
        strict: true,
        type: 'static',
        value: ['a', 'b', 'c'],
        details: {},
      },
      nullable: false,
      type_info: {},
      parameters: [],
    },
    {
      key: 'p2',
      type: 'String',
      multi: false,
      display_name: 'p2',
      optional: true,
      default: 'a',
      choices: {
        display: 'select',
        strict: true,
        type: 'static',
        value: ['a', 'b', 'c'],
        details: {},
      },
      nullable: false,
      type_info: {},
      parameters: [],
    },
    {
      key: 'message',
      type: 'String',
      multi: false,
      display_name: 'message',
      optional: false,
      description: 'Say what we want',
      choices: {
        display: 'select',
        strict: true,
        type: 'command',
        // eslint-disable-next-line no-template-curly-in-string
        value: 'get_choices_with_arguments(p1=${p1}, p2=${p2})',
        details: {
          name: 'get_choices_with_arguments',
          args: [
            ['p1', 'p1'],
            ['p2', 'p2'],
          ],
        },
      },
      nullable: false,
      type_info: {},
      parameters: [],
    },
  ],
  command_type: 'ACTION',
  output_type: 'STRING',
  schema: {},
  form: {},
  hidden: false,
  metadata: {},
}

export const selfReferringCommand: Command = {
  name: 'say_day',
  description: 'Demonstrates self-referring choices',
  parameters: [
    {
      key: 'day',
      type: 'String',
      multi: false,
      display_name: 'day',
      optional: false,
      choices: {
        display: 'typeahead',
        strict: true,
        type: 'command',
        // eslint-disable-next-line no-template-curly-in-string
        value: 'days_filter(filter_param=${day})',
        details: {
          name: 'days_filter',
          args: [['filter_param', 'day']],
        },
      },
      nullable: false,
      type_info: {},
      parameters: [],
    },
  ],
  command_type: 'ACTION',
  output_type: 'STRING',
  schema: {},
  form: {},
  hidden: false,
  metadata: {},
}
