import { Dictionary, Request } from 'types/custom_types'
import {
  CRON_KEYS,
  DATE_KEYS,
  INTERVAL_KEYS,
} from 'services/job.service/job-service-values'

const getTrigger = (triggerType: string, formModel: Dictionary) => {
  if (triggerType === 'date') {
    return {
      run_date: formModel['run_date'],
      timezone: formModel['date_timezone'],
    }
  } else if (triggerType === 'interval') {
    let weeks = 0
    let minutes = 0
    let hours = 0
    let seconds = 0
    let days = 0

    if (formModel['interval'] === 'weeks') {
      weeks = formModel['interval_num']
    } else if (formModel['interval'] === 'minutes') {
      minutes = formModel['interval_num']
    } else if (formModel['interval'] === 'hours') {
      hours = formModel['interval_num']
    } else if (formModel['interval'] === 'seconds') {
      seconds = formModel['interval_num']
    } else if (formModel['interval'] === 'days') {
      days = formModel['interval_num']
    }

    return {
      weeks: weeks,
      minutes: minutes,
      hours: hours,
      seconds: seconds,
      days: days,
      jitter: formModel['interval_jitter'],
      start_date: formModel['interval_start_date'],
      end_date: formModel['interval_end_date'],
      timezone: formModel['interval_timezone'],
      reschedule_on_finish: formModel['interval_reschedule_on_finish'],
    }
  } else if (triggerType === 'file') {
    return {
      pattern: formModel['file_pattern'],
      path: formModel['file_path'],
      recursive: formModel['file_recursive'],
      callbacks: formModel['file_callbacks'],
    }
  } else {
    return {
      minute: formModel['minute'],
      hour: formModel['hour'],
      day: formModel['day'],
      month: formModel['month'],
      day_of_week: formModel['day_of_week'],
      year: formModel['year'],
      week: formModel['week'],
      second: formModel['second'],
      jitter: formModel['cron_jitter'],
      start_date: formModel['cron_start_date'],
      end_date: formModel['cron_end_date'],
      timezone: formModel['cron_timezone'],
    }
  }
}

const formToServerModel = (formModel: Dictionary, requestTemplate: Request) => {
  const serviceModel: Dictionary = {}
  serviceModel['name'] = formModel['name']
  serviceModel['misfire_grace_time'] = formModel['misfire_grace_time']
  serviceModel['trigger_type'] = formModel['trigger_type']
  serviceModel['trigger'] = getTrigger(formModel['trigger_type'], formModel)
  serviceModel['request_template'] = requestTemplate
  serviceModel['coalesce'] = formModel['coalesce']
  serviceModel['max_instances'] = formModel['max_instances']
  return serviceModel
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getRequiredKeys = (triggerType: string) => {
  if (triggerType === 'cron') {
    const requiredKeys = []
    for (const key of CRON_KEYS) {
      if (
        ![
          'cron_start_date',
          'cron_end_date',
          'cron_timezone',
          'cron_jitter',
        ].includes(key)
      ) {
        requiredKeys.push(key)
      }
    }
    return requiredKeys
  } else if (triggerType === 'date') {
    return DATE_KEYS
  } else if (triggerType === 'file') {
    return []
  } else {
    const requiredKeys = []
    for (const key of INTERVAL_KEYS) {
      if (
        ![
          'interval_start_date',
          'interval_end_date',
          'interval_timezone',
          'interval_jitter',
          'interval_reschedule_on_finish',
        ].includes(key)
      ) {
        requiredKeys.push(key)
      }
    }
    return requiredKeys
  }
}

export { formToServerModel }
