import {
  CronTrigger,
  DateTrigger,
  IntervalTrigger,
  TriggerType,
} from 'types/backend-types'
import { EmptyObject } from 'types/custom-types'

export type CommandViewModelParameters =
  | {
      [key: string]: string | number | boolean | object | null
    }
  | EmptyObject

interface CommandViewModelComment {
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

type CommandViewJob = {
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
