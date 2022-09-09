import { Box, Button, Divider } from '@mui/material'
import useAxios from 'axios-hooks'
import PageHeader from 'components/PageHeader'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { getFormattedTable } from 'pages/JobIndex/jobIndexHelpers'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Job } from 'types/backend-types'

const JobIndex = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const [jobs, setJobs] = useState<Job[]>([])
  const [{ data, error }] = useAxios({
    url: '/api/v1/jobs',
    method: 'get',
    withCredentials: authEnabled,
  })
  const navigate = useNavigate()

  useEffect(() => {
    if (data && !error) {
      setJobs(data)
    }
  }, [data, error])

  // temporary for demo
  const createRequestOnClick = () => {
    navigate('/jobs/create')
  }

  return (
    <Box>
      <PageHeader title="Request Scheduler" description="" />
      <Button onClick={createRequestOnClick}>Create</Button>
      <Divider />
      {getFormattedTable(jobs)}
    </Box>
  )
}

export { JobIndex }
