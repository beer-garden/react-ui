import { Box, Divider } from '@mui/material'
import useAxios from 'axios-hooks'
import PageHeader from 'components/PageHeader'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { getFormattedTable } from 'pages/JobIndex/jobIndexHelpers'
import { useEffect, useState } from 'react'
import { Job } from 'types/custom_types'

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
    <Box>
      <PageHeader title="Request Scheduler" description="" />
      <Divider />
      {getFormattedTable(jobs)}
    </Box>
  )
}

export { JobIndex }
