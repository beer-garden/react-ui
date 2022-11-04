import {
  CronTrigger,
  DateTrigger,
  IntervalTrigger,
  Job,
  TriggerType,
} from 'types/backend-types'
import { ObjectWithStringKeys } from 'types/custom-types'

interface DisplayTrigger {
  trigger: ObjectWithStringKeys
  trigger_type: TriggerType
}

const formatDateTrigger = (triggerData: DateTrigger): DisplayTrigger => {
  const trigger: ObjectWithStringKeys = {
    run_date: new Date(triggerData.run_date).toISOString(),
    date_timezone: triggerData.timezone,
  }

  return {
    trigger_type: 'date',
    trigger: trigger,
  }
}

const formatIntervalTrigger = (
  triggerData: IntervalTrigger,
): DisplayTrigger => {
  const trigger: ObjectWithStringKeys = {
    ...(triggerData.timezone
      ? {
          interval_timezone: triggerData.timezone,
        }
      : null),
    ...(triggerData.jitter
      ? {
          interval_jitter: triggerData.jitter,
        }
      : null),
    ...(triggerData.reschedule_on_finish
      ? {
          interval_reschedule_on_finish: triggerData.reschedule_on_finish,
        }
      : null),
    ...(triggerData.start_date
      ? {
          interval_start_date: new Date(triggerData.start_date).toISOString(),
        }
      : null),
    ...(triggerData.end_date
      ? {
          interval_end_date: new Date(triggerData.end_date).toISOString(),
        }
      : null),
  }
  if (triggerData.seconds > 0) {
    trigger.interval = 'seconds'
    trigger.interval_num = triggerData.seconds
  } else if (triggerData.minutes > 0) {
    trigger.interval = 'minutes'
    trigger.interval_num = triggerData.minutes
  } else if (triggerData.hours > 0) {
    trigger.interval = 'hours'
    trigger.interval_num = triggerData.hours
  } else if (triggerData.days > 0) {
    trigger.interval = 'days'
    trigger.interval_num = triggerData.days
  } else if (triggerData.weeks > 0) {
    trigger.interval = 'weeks'
    trigger.interval_num = triggerData.weeks
  } else {
    trigger.interval = undefined
    trigger.interval_numb = undefined
  }
  return {
    trigger_type: 'interval',
    trigger: trigger,
  }
}

const formatCronTrigger = (triggerData: CronTrigger): DisplayTrigger => {
  const { timezone, jitter, start_date, end_date, ...strippedData } =
    triggerData
  const trigger: ObjectWithStringKeys = {
    ...strippedData,
    cron_timezone: triggerData.timezone,
    cron_jitter: triggerData.jitter,
    ...(triggerData.start_date
      ? {
          cron_start_date: new Date(triggerData.start_date).toISOString(),
        }
      : null),
    ...(triggerData.end_date
      ? {
          cron_end_date: new Date(triggerData.end_date).toISOString(),
        }
      : null),
  }

  return {
    trigger_type: 'cron',
    trigger: trigger,
  }
}

/**
 * Convert server format into RSJF format
 * @param job 
 * @returns 
 */
export const formatTrigger = (job?: Job): DisplayTrigger | null => {
  if (!job || !job.trigger) return null
  switch (job.trigger_type) {
    case 'cron':
      return formatCronTrigger(job.trigger as CronTrigger)
    case 'date':
      return formatDateTrigger(job.trigger as DateTrigger)
    case 'interval':
      return formatIntervalTrigger(job.trigger as IntervalTrigger)
    default:
      return null
  }
}
