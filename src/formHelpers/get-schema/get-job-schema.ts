import { getSchema } from './get-schema'

const jobSchema = {
  job: {
    title: 'Job Parameters',
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: 'Job name',
        description: 'A non-unique name for this job',
      },
      coalesce: {
        type: 'boolean',
        title: 'Coalesce',
        default: true,
      },
      misfire_grace_time: {
        type: 'integer',
        title: 'Misfire grace time',
        description: 'Grace time for missed jobs',
        default: 5,
      },
      max_instances: {
        type: 'integer',
        title: 'Max instances',
        description: 'Maximum number of concurrent job executions',
        minimum: 1,
        default: 3,
      },
      timeout: {
        type: 'integer',
        title: 'Timeout',
        description: 'Job timeout (in seconds)',
      },
      trigger_type: {
        title: 'Trigger Type',
        type: 'string',
        enum: ['date', 'cron', 'interval'],
      },
    },
    required: ['name', 'trigger_type'],
    dependencies: {
      trigger_type: {
        oneOf: [
          {
            properties: {
              trigger_type: {
                enum: [''],
              },
            },
          },
          {
            properties: {
              trigger_type: {
                enum: ['date'],
              },
              run_date: {
                type: 'string',
                title: 'Run date',
                description: 'Exact time to run this job',
                format: 'date-time',
              },
              date_timezone: {
                type: 'string',
                title: 'Timezone',
                description: 'The timezone associated with this job',
                default: 'UTC',
              },
            },
            required: ['run_date', 'date_timezone'],
          },
          {
            properties: {
              trigger_type: {
                enum: ['cron'],
              },
              minute: {
                type: 'string',
                title: 'Minute',
                description: 'Cron minute value',
                default: '1',
              },
              hour: {
                type: 'string',
                title: 'Hour',
                description: 'Cron hour value',
                default: '0',
              },
              day: {
                type: 'string',
                title: 'Day',
                description: 'Cron day value',
                default: '1',
              },
              month: {
                type: 'string',
                title: 'Month',
                description: 'Cron month value',
                default: '1',
              },
              day_of_week: {
                type: 'string',
                title: 'Day of Week',
                description: 'Day of week',
                default: '1',
              },
              year: {
                type: 'string',
                title: 'Year',
                description: 'Cron year value',
                default: '*',
              },
              week: {
                type: 'string',
                title: 'Week',
                description: 'Cron week value',
                default: '*',
              },
              second: {
                type: 'string',
                title: 'Second',
                description: 'Cron second value',
                default: '0',
              },
              cron_jitter: {
                type: 'number',
                title: 'Cron jitter',
                description:
                  'Advance of delay job execution by this many seconds at most',
              },
              cron_start_date: {
                type: 'string',
                title: 'Start date',
                description: 'Date when the cron should start',
                format: 'date-time',
              },
              cron_end_date: {
                type: 'string',
                title: 'End date',
                description: 'Date when the cron should end',
                format: 'date-time',
              },
              cron_timezone: {
                type: 'string',
                title: 'Timezone',
                description: 'Timezone to apply to start/end date',
                default: 'UTC',
              },
            },
            required: [
              'minute',
              'hour',
              'day',
              'month',
              'day_of_week',
              'year',
              'week',
              'second',
              'cron_timezone',
            ],
          },
          {
            properties: {
              trigger_type: {
                enum: ['interval'],
              },
              interval_num: {
                type: 'number',
                title: 'Interval number',
                description: 'Repeat this job every X of the interval',
                minimum: 1,
                default: 1,
              },
              interval: {
                type: 'string',
                title: 'Interval',
                description: 'Repeat this job every X of this interval',
                enum: ['seconds', 'minutes', 'hours', 'days', 'weeks'],
                default: 'hours',
              },
              interval_jitter: {
                type: 'integer',
                title: 'Interval jitter',
                minimum: 0,
                description:
                  'Advance or delay job execution by this many seconds at most',
              },
              interval_reschedule_on_finish: {
                type: 'boolean',
                title: 'Reschedule on finish',
                description: 'Reset the interval timer when the job finishes',
              },
              interval_start_date: {
                type: 'string',
                title: 'Start date',
                description: 'Date when the job should start',
                format: 'date-time',
              },
              interval_end_date: {
                type: 'string',
                title: 'End date',
                description: 'Date when the job should end',
                format: 'date-time',
              },
              interval_timezone: {
                type: 'string',
                title: 'Timezone',
                description: 'Timezone to apply to start/end date',
                default: 'UTC',
              },
            },
          },
        ],
      },
    },
  },
}

const getJobSchema = (baseSchema: ReturnType<typeof getSchema>) => {
  return {
    properties: {
      ...baseSchema.properties,
      ...jobSchema,
    },
  }
}

export { getJobSchema }
