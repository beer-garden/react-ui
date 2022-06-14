import { Divider } from '@mui/material'
import useAxios from 'axios-hooks'
import { useEffect, useState } from 'react'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import PageHeader from 'components/PageHeader'
import { Job } from 'types/custom_types'
import { getFormattedTable } from 'pages/JobIndex/jobIndexHelpers'

const JobIndex = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const [jobs, setJobs] = useState<Job[]>([])
  const [{ data, error }] = useAxios({
    url: '/api/v1/jobs',
    method: 'get',
    withCredentials: authEnabled,
  })

  useEffect(() => {
    if (data && !error) {
      setJobs(data)
    }
  }, [data, error])

  return (
    <div>
      <PageHeader title="Request Scheduler" description="" />
      <Divider />
      {getFormattedTable(jobs)}
    </div>
  )
}

export { JobIndex }
