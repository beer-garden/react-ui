import RequestTable from 'components/table'
import { Link as RouterLink } from 'react-router-dom'
import { Job } from 'types/backend-types'

const tableHeads = [
  'Job Name',
  'Status',
  'System',
  'Instance',
  'Command',
  'Next Run Time',
  'Success Count',
  'Error Count',
]
const formatJobs = (jobs: Job[]) => {
  const formattedJobs: (string | JSX.Element | number | null)[][] = []

  for (const job in jobs) {
    const {
      name,
      id,
      status,
      request_template: {
        system,
        namespace,
        instance_name: instanceName,
        command,
      },
      next_run_time: nextRunTime,
      success_count: successes,
      error_count: errors,
    } = jobs[job]

    const formattedJob = [
      <RouterLink key={name} to={'/jobs/' + id}>
        {name}
      </RouterLink>,
      status,
      <RouterLink key={system} to={'/systems/' + namespace + '/' + system} />,
      instanceName,
      command,
      new Date(nextRunTime).toString(),
      successes,
      errors,
    ]

    formattedJobs.push(formattedJob)
  }
  return formattedJobs
}

const getFormattedTable = (jobs: Job[]) => {
  return (
    <RequestTable
      parentState={{
        completeDataSet: jobs,
        formatData: formatJobs,
        cacheKey: `lastKnown_${window.location.href}`,
        includePageNav: true,
        disableSearch: true,
        tableHeads: tableHeads,
      }}
    />
  )
}

export { formatJobs, getFormattedTable }
