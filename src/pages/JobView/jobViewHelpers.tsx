import { Backdrop, Box, CircularProgress } from '@mui/material'
import JobTable from 'components/table'
import ReactJson from 'react-json-view'
import { Link as RouterLink } from 'react-router-dom'
import { Job } from 'types/backend-types'

const tableHeads = [
  'Job Name',
  'System',
  'System Version',
  'Instance Name',
  'Command',
  'Status',
  'Success Count',
  'Error Count',
  'Next Run Time',
]

const formatJob = (jobs: Job[]) => {
  if (!jobs) return []

  const job = jobs.pop()
  const {
    status,
    name,
    success_count: successes,
    error_count: errors,
    next_run_time: scheduled,
    request_template: {
      system,
      namespace,
      system_version: version,
      instance_name: instance,
      command,
    },
  } = job as Job

  const nextRunTime =
    scheduled && status === 'RUNNING' ? new Date(scheduled).toString() : ''

  return [
    [
      name,
      <RouterLink
        key={name + system + namespace + name + system + version}
        to={'/systems/' + namespace + '/' + system}
      >
        {system}
      </RouterLink>,
      <RouterLink
        key={namespace + name + system + version}
        to={'/systems/' + namespace + '/' + system + '/' + version}
      >
        {version}
      </RouterLink>,
      instance,
      command,
      status as string,
      successes || 0,
      errors || 0,
      nextRunTime,
    ],
  ]
}

const getFormattedTable = (jobs: Job[]) => {
  if (jobs.length > 0) {
    const job = jobs.pop() as Job
    const trigger = job.trigger
    const template = job.request_template

    return (
      <>
        <JobTable
          parentState={{
            completeDataSet: jobs,
            formatData: formatJob,
            cacheKey: `lastKnown_${window.location.href}`,
            includePageNav: false,
            disableSearch: true,
            tableHeads: tableHeads,
          }}
        />
        <Box p={2} display="flex" alignItems="flex-start">
          <Box width={1 / 2}>
            <h3>Triggers</h3>
            <Box border={1}>
              <ReactJson src={trigger} />
            </Box>
          </Box>
          <Box pl={1} width={1 / 2}>
            <h3>Request Template</h3>
            <Box border={1}>
              <ReactJson src={template} />
            </Box>
          </Box>
        </Box>
      </>
    )
  }
  return (
    <Backdrop open={true}>
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}

export { getFormattedTable }
