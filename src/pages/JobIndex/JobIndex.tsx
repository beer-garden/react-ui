import { Button } from '@mui/material'
import { Divider } from 'components/Divider'
import { PageHeader } from 'components/PageHeader'
import { Table } from 'components/Table'
import { PermissionsContainer } from 'containers/PermissionsContainer'
import { useJobs } from 'hooks/useJobs'
import { JobTableData, useJobColumns } from 'pages/JobIndex'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Job } from 'types/backend-types'
import { dateFormatted } from 'utils/date-formatter'

const JobIndex = () => {
  const { hasPermission } = PermissionsContainer.useContainer()
  const [jobs, setJobs] = useState<Job[]>([])
  const { getJobs } = useJobs()
  const navigate = useNavigate()

  useEffect(() => {
    getJobs().then((response) => {
      setJobs(response.data)
    })
    // TODO: alert catch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // temporary for demo
  const createRequestOnClick = () => {
    navigate('/jobs/create')
  }

  const jobData = useMemo((): JobTableData[] => {
    return jobs.map((job: Job): JobTableData => {
      return {
        name: (
          <Link key={job.name} to={`/jobs/${job.id}`}>
            {job.name}
          </Link>
        ),
        status: job.status || '',
        system: (
          <Link
            key={job.request_template.system}
            to={`/jobs/${job.request_template.namespace}/${job.request_template.system}`}
          >
            {job.request_template.system}
          </Link>
        ),
        instance: job.request_template.instance_name,
        command: job.request_template.command,
        nextRun: job.next_run_time
          ? dateFormatted(new Date(job.next_run_time))
          : '',
        success: job.success_count || 0,
        error: job.error_count || 0,
      }
    })
  }, [jobs])

  return (
    <>
      <PageHeader title="Request Scheduler" description="" />
      <Divider />
      <Table tableKey="JobIndex" data={jobData} columns={useJobColumns()}>
        {hasPermission('job:create') && (
          <Button onClick={createRequestOnClick}>Create</Button>
        )}
      </Table>
    </>
  )
}

export { JobIndex }
