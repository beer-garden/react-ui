import {
  CronTrigger,
  DateTrigger,
  IntervalTrigger,
  TriggerType,
} from 'types/backend-types'
import { EmptyObject } from 'types/custom-types'

export type CommandViewModelParametersArrayValueType = Array<
  string | number | boolean | object | null
>

export type CommandViewModelParametersValueType =
  | string
  | number
  | boolean
  | object
  | null
  | CommandViewModelParametersArrayValueType

export type CommandViewModelParameters =
  | {
      [key: string]: CommandViewModelParametersValueType
    }
  | EmptyObject

export interface CommandViewModelComment {
  comment: string
}

interface CommandViewModelInstances {
  instance_name: string
}

export interface CommandViewRequestModel {
  comment: CommandViewModelComment
  instance_names: CommandViewModelInstances
  parameters: CommandViewModelParameters
}

export type CommandViewJob = {
  [index: string]: number | string | boolean | undefined
  coalesce?: boolean
  max_instances?: number
  misfire_grace_time?: number
  name: string
  timeout?: number
  trigger: TriggerType | ''
} & (Partial<CronTrigger> | Partial<DateTrigger> | Partial<IntervalTrigger>)

export type CommandViewJobModel = CommandViewRequestModel & {
  job: CommandViewJob
}

export type CommandViewModel = CommandViewRequestModel | CommandViewJobModel
