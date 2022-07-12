export interface CommandBase {
  namespace: string
  system: string
  command: string
}

export interface BlockedCommand extends CommandBase {
  status?: string
  id?: string
}

export interface CommandRow extends BlockedCommand {
  action: JSX.Element
  name: string | JSX.Element
  description?: string
  version?: string
}

export interface BlockedList {
  command_publishing_blocklist: BlockedCommand[]
}

export interface Command {
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

export interface Parameter {
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

interface Choice {
  display: string
  strict: boolean
  type: string
  value: any
  details: any
}
