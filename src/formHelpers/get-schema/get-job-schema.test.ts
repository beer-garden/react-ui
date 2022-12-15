import { TFullSimpleParameter, TSingleInstanceArray } from 'test/test-values'

import { getJobSchema } from './get-job-schema'
import { getSchema } from './get-schema'

describe('Get job schema', () => {
  test('basic properties', () => {
    const schema = getSchema(TSingleInstanceArray, [TFullSimpleParameter])
    const jobSchema = getJobSchema(schema)

    for (const tag of [
      'properties.job.title',
      'properties.job.type',
      'properties.job.properties',
      'properties.job.required',
      'properties.job.dependencies',
    ]) {
      expect(jobSchema).toHaveProperty(tag)
    }

    const properties = jobSchema.properties.job.properties

    for (const tag of [
      'name',
      'coalesce',
      'misfire_grace_time',
      'max_instances',
      'timeout',
      'trigger',
    ]) {
      expect(properties).toHaveProperty(tag)
    }
  })
})
