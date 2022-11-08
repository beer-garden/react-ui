import { Box, Button } from '@mui/material'
import useAxios from 'axios-hooks'
import { Divider } from 'components/Divider'
import { PageHeader } from 'components/PageHeader'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { PermissionsContainer } from 'containers/PermissionsContainer'
import { getFormattedTable } from 'pages/JobIndex/jobIndexHelpers'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Job } from 'types/backend-types'

const JobIndex = () => {
  const { authEnabled } = ServerConfigContainer.useContainer()
  const { hasPermission } = PermissionsContainer.useContainer()
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
      <Divider />
      {hasPermission('job:create') && (
        <Button onClick={createRequestOnClick}>Create</Button>
      )}
      {getFormattedTable(jobs)}
    </Box>
  )
}

export { JobIndex }
